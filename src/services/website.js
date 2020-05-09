const logger = require('../logger')('website-service');
const { joinUrls } = require('../utils');
const cheerio = require('cheerio');
const fetch = require('node-fetch');
const normalizeUrl = require('normalize-url');


async function getMetadata (html, websiteUrl) {
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

  let image = null;
  let title = getMetaTag('title') || $('title').first().text();
  let url = normalizeUrl(websiteUrl || getMetaTag('url'));
  let type = getMetaTag('type');
  let name = getMetaTag('site_name');
  let description = getMetaTag('description');
  let author = getMetaTag('author');
  let keywords = getMetaTag('keywords')
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
    () => `${joinUrls(url, '/favicon.ico')}`
  ];

  // generate image url candidates
  const imageUrlCandidates = imageMetaTagsList
    .map(tagCb => joinUrls(url, tagCb('image')));

  // select first ok candidate
  for (let i = 0; i < imageUrlCandidates.length; i++) {
    const imageUrl = imageUrlCandidates[i];
    const isAvailable = await isResourceAvailable(imageUrl)
    if (isAvailable) {
      image = imageUrl;
      break;
    }
  }

  return { title, type, name, description, author, image, url, keywords };
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
    response = await fetch(url);
  } catch (e) {
    logger.info(`Website ${url} fetch failed`, e);
    throw e;
  }
  if (!response.ok) {
    logger.info(`Website ${url} responded with ${response.status}`);
    throw new Error(response.statusText);
  } else {
    return response.text();
  }
}

module.exports = {
  getMetadata,
  getHtml
};
