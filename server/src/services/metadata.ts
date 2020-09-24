import { ImageServiceInt } from "./image";
import Link from "../models/link";
import Repository from "../models/repository";
import Website from "../models/website";
import logger from "../logger";
import { GithubServiceInt } from "./github";
import { execute, makeDir } from "../utils";

const uuid = require('uuid').v4;
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const fetch = require('node-fetch');
const normalizeUrl = require('normalize-url');
const path = require('path');

export interface MetaServiceInt {
  getLinkWithMetadata (url: string, source?: string): Promise<Link>;

  screenshotWebsite (url: string, filePath: string, waitTime: number): Promise<any>;

  getParsedWebsite (html: string, url: string): Promise<Website>;

  fetchHtml (url: string): Promise<string>;
}

interface MetaServiceProps {
  imageService?: ImageServiceInt;
  githubService?: GithubServiceInt;
}

export default function MetaService ({
  imageService,
  githubService
}: MetaServiceProps): MetaServiceInt {
  const log = logger('meta-service');

  async function getLinkWithMetadata (url: string, source?: string) {
    const link = new Link(url, source);

    async function getWebsite (url) {
      const html = await fetchHtml(url);
      const website = await getParsedWebsite(html, url);
      // cache directory
      const cacheDir = process.env.CACHE_DIR_PATH || path.join(__dirname, '..', '.cache');
      // take a screenshot and upload it to image store
      await makeDir(cacheDir);
      const screenshotPath = path.join(cacheDir, `${uuid()}.png`);
      try {
        await screenshotWebsite(website.url, screenshotPath);
      } catch (e) {
        log.error(`Error while taking a screenshot: ${e.message}`)
        throw e;
      }
      let response;
      try {
        response = await imageService.upload(screenshotPath, website.uid)
      } catch (e) {
        log.error(`Error while uploading to image store: ${JSON.stringify(e, null, 2)}`);
        throw e;
      }
      website.screenshot = response.secure_url;
      website.screenshotId = response.public_id;
      return website;
    }

    if (Repository.isGithubRepository(url)) {
      link.repository = await githubService.getRepository(url, false);
      if (link.repository.homepage) {
        link.website = await getWebsite(link.repository.homepage);
      }
    } else {
      link.website = await getWebsite(url);
    }

    return link;
  }

  // TODO: parse headings + paragraphs ?
  // TODO: index website content ?
  async function getParsedWebsite (html: string, url: string): Promise<Website> {
    const $ = cheerio.load(html);

    const metaTagsList = [
      name => $(`meta[name="${name}"]`).attr('content'),
      name => $(`meta[name="og:${name}"]`).attr('content'),
      name => $(`meta[name="twitter:${name}]"]`).attr('content'),
      name => $(`meta[name="twitter:${name}:src]"]`).attr('content'),
      name => $(`meta[property="${name}"]`).attr('content'),
      name => $(`meta[property="og:${name}"]`).attr('content'),
      name => $(`meta[property="twitter:${name}]"]`).attr('content'),
      name => $(`meta[property="twitter:${name}:src]"]`).attr('content')
    ];

    const getMetaTag = name => {
      for (let tag of metaTagsList) {
        if (tag(name)) {
          return tag(name);
        }
      }
      return null;
    }

    // TODO: provide separate fields for favicon and meta images
    const website = new Website(url);
    website.icon = joinUrls(url, $(`link[rel="icon"]`).attr('href'));
    website.image = null;
    website.title = getMetaTag('title') || $('title').first().text();
    website.url = normalizeUrl(url || getMetaTag('url'));
    website.type = getMetaTag('type');
    website.name = getMetaTag('site_name');
    website.description = getMetaTag('description');
    website.author = getMetaTag('author');
    website.keywords = getMetaTag('keywords')
      ? getMetaTag('keywords')
        .split(',')
        .map(k => k.trim().toLowerCase())
        // include only keywords that do not exceed size of 30 words
        // because some websites put some other separating characters than ','
        .filter(value => value.length > 0 && value.length < 30)
      : [];

    const imageMetaTagsList = [
      ...metaTagsList,
      () => $('link[rel="shortcut icon"]').attr('href'),
      () => $('link[rel=shortcut-icon]').attr('href'),
      () => $('link[rel=mack-icon]').attr('href'),
      () => `${joinUrls(url, '/favicon.ico')}`
    ];

    // generate image url candidates
    const imageUrlCandidates = imageMetaTagsList
      .map(tagCb => joinUrls(url, tagCb('image')));

    // helper function that checks if resource exists
    const isResourceAvailable = async url => {
      if (url !== undefined) {
        return (await fetch(url)).ok;
      } else {
        return false;
      }
    }

    // test urls by fetching resources with http
    const imageUrlResults = await Promise.all(
      imageUrlCandidates.map(isResourceAvailable)
    );

    // select first response that succeeds
    for (let i = 0; i < imageUrlResults.length; i++) {
      if (imageUrlResults[i] === true) {
        website.image = imageUrlCandidates[i];
        break;
      }
    }

    return website;
  }

  async function screenshotWebsite (url: string, outputPath: string, waitTime = 0): Promise<any> {
    const wait = ms => new Promise(
      resolve => setTimeout(resolve, ms)
    );
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({
      width: 1300,
      height: 1000,
      deviceScaleFactor: 1,
    });
    // remove the navigation timeout limit
    await page.setDefaultNavigationTimeout(0);
    await page.goto(url, { waitUntil: ['networkidle2'] });
    if (waitTime > 0) {
      // wait if there is some loading animation
      log.debug(`Waiting for ${waitTime}ms before taking screenshot of ${url}`);
      await wait(waitTime);
    }
    await page.screenshot({ path: outputPath });
    await browser.close();
  }

  async function fetchHtml (url: string): Promise<string> {
    let response;
    try {
      response = await execute(`Fetching ${url}`, fetch(url));
    } catch (e) {
      log.error(`Website ${url} fetch failed: ${e.message}`);
      throw e;
    }
    if (!response.ok) {
      log.error(`Website ${url} responded with ${response.status}`);
      throw new Error(response.statusText);
    } else {
      return response.text();
    }
  }

  const isRelativeUrl = url => (
    url !== undefined &&
    url !== null &&
    !/http/.test(url)
  );

  const joinUrls = (rootUrl, path) => {
    if (!isRelativeUrl(path)) {
      return path;
    }
    let urlEndIndex = rootUrl.indexOf('/', 8);
    if (urlEndIndex > 0) {
      return rootUrl.substring(0, urlEndIndex) + path;
    } else {
      let suffixUrl = path[0] === '/' ? path : '/' + path;
      return rootUrl.substring(0, rootUrl.length) + suffixUrl;
    }
  };

  return {
    getLinkWithMetadata,
    screenshotWebsite,
    getParsedWebsite,
    fetchHtml
  }
}
