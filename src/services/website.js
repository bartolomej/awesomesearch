const Website = require('../models/website');
const repo = require('../repositories/website');
require('node-fetch');


async function scrapeUrls (urls) {
  // returns failed websites error
  return await Promise.all(
    urls.map(url => scrapeUrl(url).catch(e => e))
  );
}

async function scrapeUrl (url) {
  let website;
  try {
    website = await repo.getWebsiteByUrl(url);
  } catch (e) {
    if (e.message === 'Website not found') {
      website = new Website(url);
    } else {
      throw new Error('Unexpected error');
    }
  }
  const html = await getHtml(url);
  website.scrape(html);
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
      throw e;
    }
  }
  if (!response.ok) {
    throw new Error(response.statusText);
  } else {
    return response.text();
  }
}

module.exports = {
  scrapeUrls,
  scrapeUrl,
  getHtml
};
