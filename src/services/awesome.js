const github = require('../gateways/github');
const { selectAll } = require("unist-util-select");
const unified = require('unified');
const markdown = require('remark-parse');
const normalizeUrl = require('normalize-url');
const { execute } = require('../utils');
const logger = require('../logger')('awesome-service');
const Awesome = require('../models/awesome');


async function getAwesomeListData (uid) {

  // fetch repo info via GitHub API
  const [topics, repo, readme] = await execute(`GitHub API call to ${uid}`, [
      github.getRepositoryTopics(uid).catch(onGithubError),
      github.getRepositoryInfo(uid).catch(onGithubError),
      github.getReadme(uid).catch(onGithubError)
    ]
  );

  function onGithubError (e) {
    logger.error(`Error fetching from Github API: ${e.message}`);
    throw e;
  }

  // scrape website urls found in readme
  const urls = parseReadme(readme, false);
  logger.info(`Found ${urls.length} urls repo:${uid}`);

  return {
    homepage: repo.homepage,
    description: repo.description,
    stars: repo.stars,
    forks: repo.forks,
    topics,
    urls
  };
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

module.exports = {
  getAwesomeListData,
  parseReadme
};
