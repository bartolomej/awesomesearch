const logger = require('../logger')('website-service');
const uuid = require('uuid').v4;
const { joinUrls } = require('../utils');
const cheerio = require('cheerio');
const fetch = require('node-fetch');
const normalizeUrl = require('normalize-url');
const { execute } = require('../utils');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const Link = require('../models/link');
const Repository = require('../models/repository');
const Website = require('../models/website');
const githubService = require('../services/github');


function MetaService ({ imageService }) {

  async function getMetadata (url, source) {
    const link = new Link(url, source);

    async function getWebsite (url) {
      const html = await getHtml(url);
      const website = await parseHtml(html, url);
      try {
        let wait = /portfolio/g.test(source) ? 4000 : 1000;
        const response = await processScreenshot(website, wait);
        website.screenshot = response.url;
        website.screenshotId = response.id;
      } catch (e) {
        logger.error(`Error processing ${website.uid} screenshot: ${e}`);
      }
      return website;
    }

    if (Repository.isGithubRepository(url)) {
      link.repository = await githubService.getRepository(url);
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
  async function parseHtml (html, websiteUrl) {
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
    const website = new Website(websiteUrl);
    website.image = null;
    website.title = getMetaTag('title') || $('title').first().text();
    website.url = normalizeUrl(websiteUrl || getMetaTag('url'));
    website.type = getMetaTag('type');
    website.name = getMetaTag('site_name');
    website.description = getMetaTag('description');
    website.author = getMetaTag('author');
    website.keywords = getMetaTag('keywords')
      ? getMetaTag('keywords')
        .split(',')
        .map(k => k.trim())
        .filter(value => value.length > 0)
      : [];

    const imageMetaTagsList = [
      ...metaTagsList,
      () => $('link[rel=icon]').attr('href'),
      () => $('link[rel="shortcut icon"]').attr('href'),
      () => $('link[rel=shortcut-icon]').attr('href'),
      () => $('link[rel=mack-icon]').attr('href'),
      () => `${joinUrls(websiteUrl, '/favicon.ico')}`
    ];

    // generate image url candidates
    const imageUrlCandidates = imageMetaTagsList
      .map(tagCb => joinUrls(websiteUrl, tagCb('image')));

    // test urls by fetching resources with http
    const imageUrlResults = await Promise.all(
      imageUrlCandidates.map(isResourceAvailable)
    );

    // select first ok candidate
    for (let i = 0; i < imageUrlResults.length; i++) {
      if (imageUrlResults[i] === true) {
        website.image = imageUrlCandidates[i];
        break;
      }
    }

    return website;
  }

  async function processScreenshot (website, waitBeforeScreenshot = 0) {
    // take a screenshot and upload it to image store
    const cachePath = path.join(__dirname, '..', '..', 'cache');
    if (!fs.existsSync(cachePath)) {
      fs.mkdirSync(cachePath);
    }
    const screenshotPath = path.join(cachePath, `${uuid()}.png`);
    try {
      await screenshotWebsite(website.url, screenshotPath, waitBeforeScreenshot);
    } catch (e) {
      logger.error(`Error while taking a screenshot: ${e.message}`)
      throw e;
    }
    try {
      const response = await imageService.upload(screenshotPath, website.uid)
      return {
        url: response.secure_url,
        id: response.public_id
      }
    } catch (e) {
      logger.error(`Error while uploading to image store: ${e.message}`);
      throw e;
    }
  }

  async function screenshotWebsite (url, outputPath, waitBeforeScreenshot = 0) {
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
    if (waitBeforeScreenshot > 0) {
      // wait if there is some loading animation
      logger.debug(`Waiting for ${waitBeforeScreenshot}ms before taking screenshot of ${url}`);
      await wait(waitBeforeScreenshot);
    }
    await page.screenshot({ path: outputPath });
    await browser.close();
  }

  const isResourceAvailable = async url => {
    if (url !== undefined) {
      const response = await fetch(url);
      return response.ok;
    } else {
      return false;
    }
  }

  async function getHtml (url) {
    let response;
    try {
      response = await execute(`Fetching ${url}`, fetch(url));
    } catch (e) {
      logger.error(`Website ${url} fetch failed: ${e.message}`);
      throw e;
    }
    if (!response.ok) {
      logger.error(`Website ${url} responded with ${response.status}`);
      throw new Error(response.statusText);
    } else {
      return response.text();
    }
  }

  return { getMetadata, getHtml, parseHtml, screenshotWebsite }
}

module.exports = MetaService;
