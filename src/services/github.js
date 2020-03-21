const github = require('../gateways/github');
const website = require('../services/website');
const repo = require('../repositories/github');
const Awesome = require('../models/awesome');


async function scrapeAwesomeRoot () {
  const readme = await github.getRepositoryFile('sindresorhus/awesome', 'readme');
  const urls = Awesome.parseReadme(readme);
  return await Promise.all(urls.map(async url => {
    const awesome = new Awesome(url);
    await repo.saveAwesome(awesome);
    return updateAwesome(awesome.uid);
  }));
}

async function updateAwesome (uid) {
  const awesome = await repo.getAwesome(uid);
  const readme = await github.getRepositoryFile(awesome.uid, 'readme');
  const newUrls = awesome.updateUrls(readme);
  await website.scrapeUrls(newUrls);
  return await repo.saveAwesome(awesome);
}



module.exports = {
  scrapeAwesomeRoot,
  updateAwesome,
};
