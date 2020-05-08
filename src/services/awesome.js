const github = require('../gateways/github');
const website = require('../services/website');
const repo = require('../repositories/awesome');
const Awesome = require('../models/awesome');
const { performance } = require('perf_hooks');
const logger = require('../logger')('awesome-service');

const AWESOME_README_ROOT_ID = 'sindresorhus/awesome';

async function scrapeAwesomeRoot () {
  const readme = await github.getReadme(AWESOME_README_ROOT_ID);
  const urls = Awesome.parseReadme(readme, true);
  return await Promise.all(urls.map(async url => (
    updateAwesome(url).catch(error => {
      logger.info(`Update failed for ${url}`, error);
      return error;
    })
  )));
}

async function updateAwesome (url) {
  const uid = Awesome.getUidFromUrl(url);
  let awesome;
  try {
    awesome = await repo.getAwesome(uid);
  } catch (e) {
    if (e.message === 'Entity not found') {
      awesome = new Awesome(url);
    }
  }
  // fetch repo info via GitHub API
  let githubMeta;
  try {
    githubMeta = await execute(`GitHub API call to ${uid}`, [
        github.getRepositoryTopics(uid),
        github.getRepositoryInfo(uid),
        github.getReadme(uid)
      ]
    );
  } catch (e) {
    logger.info(`GitHub API calls failed`, e);
    throw e;
  }
  awesome.setInfo({ topics: githubMeta[0], ...githubMeta[1] });
  // scrape website urls found in readme
  const urls = awesome.updateUrls(githubMeta[2]);
  logger.info(`Found ${urls.length} urls in ${uid}`);
  await repo.saveAwesome(awesome);
  // returns failed websites error
  return await execute(
    `Website scraping for ${uid}`,
    urls.map(url => website.scrapeUrl(url).catch(e => e))
  );
}

async function execute (name, promises) {
  const start = performance.now();
  const result = await Promise.all(promises);
  const duration = performance.now() - start;
  logger.info(`${name} took ${duration} ms`);
  return result;
}

module.exports = {
  scrapeAwesomeRoot,
  updateAwesome,
};
