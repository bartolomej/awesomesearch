const github = require('../gateways/github');
const website = require('../services/website');
const repo = require('../repositories/awesome');
const Awesome = require('../models/awesome');


async function scrapeAwesomeRoot () {
  const readme = await github.getReadme('sindresorhus/awesome');
  const urls = Awesome.parseReadme(readme);
  return await Promise.all(urls.map(async url => {
    const awesome = new Awesome(url);
    await repo.saveAwesome(awesome);
    return updateAwesome(awesome.uid).catch(e => e);
  }));
}

async function updateAwesome (uid) {
  // TODO: fetch more repo metadata (topics,...)
  const awesome = await repo.getAwesome(uid);
  const readme = await github.getReadme(awesome.uid);
  const newUrls = awesome.updateUrls(readme);
  await repo.saveAwesome(awesome);
  return await website.scrapeUrls(newUrls);
}



module.exports = {
  scrapeAwesomeRoot,
  updateAwesome,
};
