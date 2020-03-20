const { getRepositoryFile } = require('../gateways/github');
const { saveAwesome, getAwesome, saveWebsite, saveLink } = require('../repositories/github');
const Awesome = require('../models/awesome');
const Website = require('../models/website');
require('node-fetch');


async function scrapeAwesomeRoot () {
  const readme = await getRepositoryFile('sindresorhus/awesome', 'readme');
  const links = Awesome.parseReadme(readme);
  for (let link of links) {
    const awesome = new Awesome(link);
    await saveAwesome(awesome);
    await updateAwesome(awesome.uid);
  }
}

async function updateAwesome (uid) {
  const awesome = await getAwesome(uid);
  const readme = await getRepositoryFile(awesome.uid, 'readme');
  const links = awesome.updateLinks(readme);
  const html = await getHtml(awesome.url);
  awesome.website.scrape(html);
  for (let link of links) {
    await saveLink(link);
  }
  await scrapeWebsites(links);
}

async function scrapeWebsites (links) {
  const html = await Promise.all(
    links.map(l => getHtml(l.url))
  );
  for (let i = 0; i < links.length; i++) {
    const website = new Website(links[i]);
    website.scrape(html[i]);
    await saveWebsite(website);
  }
}

async function getHtml (url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(response.statusText);
  } else {
    return response.text();
  }
}

module.exports = {
  scrapeAwesomeRoot,
  updateAwesome,
  scrapeWebsites
};
