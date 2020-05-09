const github = require('../gateways/github');
const { selectAll } = require("unist-util-select");
const unified = require('unified');
const markdown = require('remark-parse');
const normalizeUrl = require('normalize-url');
const { performance } = require('perf_hooks');
const logger = require('../logger')('awesome-service');
const Awesome = require('../models/awesome');


async function getAwesomeListData (url) {
  const uid = Awesome.getUidFromUrl(url);
  // fetch repo info via GitHub API
  const [topics, repo, readme] = await execute(`GitHub API call to ${uid}`, [
      github.getRepositoryTopics(uid),
      github.getRepositoryInfo(uid),
      github.getReadme(uid)
    ]
  );
  // scrape website urls found in readme
  const urls = parseReadme(readme, false);
  logger.info(`Found ${urls.length} urls in ${uid}`);

  return new Awesome(url, null,
    repo.homepage,
    repo.stars,
    repo.forks,
    topics,
    urls
  );
}

function parseReadme (text, isRoot = false) {
  const tree = unified().use(markdown).parse(text);
  let urls = [];
  const links = selectAll('link', tree);
  for (let link of links) {
    if (Awesome.isValidUrl(link.url, isRoot)) {
      try {
        urls.push(normalizeUrl(link.url));
      } catch (e) {
        logger.info(`Invalid url ${link.url} on normalization`);
      }
    }
  }
  return urls;
}

async function execute (name, promises) {
  const start = performance.now();
  const result = await Promise.all(promises);
  const duration = performance.now() - start;
  logger.info(`${name} took ${duration} ms`);
  return result;
}

module.exports = {
  getAwesomeListData,
  parseReadme
};
