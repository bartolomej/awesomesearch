const github = require('../services/github');
const { selectAll } = require("unist-util-select");
const unified = require('unified');
const markdown = require('remark-parse');
const normalizeUrl = require('normalize-url');
const logger = require('../logger')('awesome-service');
const List = require('../models/list');


async function getAwesomeListData (url) {

  // fetch repo info via GitHub API
  const repository = await github.getRepository(url, true);

  // scrape website urls found in readme
  const urls = parseReadme(repository.readme, false);
  logger.info(`Found ${urls.length} urls repo:${repository.user}/${repository.name}`);

  return new List(url, repository, urls);
}

function parseReadme (text, isRoot = false) {
  const tree = unified().use(markdown).parse(text);
  let urls = [];
  const links = selectAll('link', tree);
  for (let link of links) {
    if (List.isValidUrl(link.url, isRoot)) {
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
