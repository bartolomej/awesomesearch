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
  // fetch repo info via GitHub API
  const info = await Promise.all([
    github.getRepositoryTopics(uid),
    github.getRepositoryInfo(uid),
    github.getReadme(uid)
  ]);
  const awesome = await repo.getAwesome(uid);
  awesome.setInfo({ topics: info[0], ...info[1] });
  const newUrls = awesome.updateUrls(info[2]);
  await repo.saveAwesome(awesome);
  return await website.scrapeUrls(newUrls);
}



module.exports = {
  scrapeAwesomeRoot,
  updateAwesome,
};
