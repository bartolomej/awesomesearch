const Website = require('../models/website');
const repo = require('../repositories/website');
const logger = require('../logger')('website-service');
require('node-fetch');


async function scrapeUrl (url) {
  let website;
  try {
    website = await repo.getWebsiteByUrl(url);
  } catch (e) {
    if (e.message === 'Entity not found') {
      website = new Website(url);
    } else {
      logger.error(`Unexpected database error`, e);
      throw new Error('Unexpected database error');
    }
  }
  const html = await getHtml(url);
  // extract metadata from raw html
  const metadata = await Website.extractMetadata(html, url);
  await website.setMetadata(metadata);  // sets internal properties
  return await repo.saveWebsite(website);
}

async function getHtml (url) {
  let response;
  try {
    response = await fetch(url);
  } catch (e) {
    if (/getaddrinfo ENOTFOUND/.test(e.message)) {
      throw new Error('Website not found');
    } else {
      logger.info(`Website ${url} fetch failed`, e);
      throw e;
    }
  }
  if (!response.ok) {
    logger.info(`Website ${url} responded with ${response.status}`);
    throw new Error(response.statusText);
  } else {
    return response.text();
  }
}

module.exports = {
  scrapeUrl,
  getHtml
};
