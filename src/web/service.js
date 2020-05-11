const logger = require('../logger')('web-service');
const repo = require('./repository');
const github = require('../gateways/github');
const awesomeService = require('../services/awesome');
const Website = require('../models/website');
const Awesome = require('../models/awesome');
const FlexSearch = require("flexsearch");
const Queue = require('bull');

const redisUrl = process.env.REDIS_URL;
const workQueue = new Queue('work', redisUrl);

// https://github.com/nextapps-de/flexsearch#presets
const index = new FlexSearch({
  encode: "advanced",
  tokenize: "reverse",
  suggest: true,
});

/**
 * Triggered when jobs are completed with resulting value.
 */
workQueue.on('global:completed', async (jobId, result) => {
  const job = await getJob(jobId);

  logger.info(`Job ${job.id}:${job.name} completed !`);

  if (job.name === 'awesome') {
    const awesome = Awesome.fromJson(result)
    // add serialized string data to search index
    index.add(awesome.uid, awesome.serializeToIndex());
    repo.saveAwesome(awesome);
    // post website jobs for found urls
    for (let url of awesome.urls) {
      await workQueue.add('website', { website: new Website(url, awesome.uid) });
    }
  } else if (job.name === 'website') {
    const website = Website.fromJson(result)
    repo.saveWebsite(website)
    // add serialized string data to search index
    index.add(website.uid, website.serializeToIndex());
  }
});

function randomItems (n = 6) {
  let results = [];
  for (let i = 0; i < n; i++) {
    results.push({
      object_type: 'link',
      ...repo.randomWebsite()
    });
  }
  return results;
}

async function search (query, page = true, limit = 15) {
  const results = await index.search(query, { limit, page });
  const result = results.result ?
    results.result.map(id => {
      try {
        return repo.getWebsite(id);
      } catch (e) {}
      try {
        return repo.getAwesome(id);
      } catch (e) {}
    }) : [];
  return {
    page: parseInt(results.page),
    next: results.next ? parseInt(results.next) : null,
    result
  };
}

function getItem (uid) {
  try {
    return repo.getWebsite(uid)
  } catch (e) {}
  try {
    return repo.getAwesome(uid)
  } catch (e) {}
  throw new Error('Object not found');
}

function searchStats () {
  return index.stats;
}

async function getJob (id) {
  return await workQueue.getJob(id);
}

async function scrapeWebsite (url) {
  return await workQueue.add('website', { website: new Website(url) });
}

async function fetchAwesomeRepo (url) {
  return await workQueue.add('awesome', { repo: new Awesome(url) });
}

async function fetchAwesomeFromRoot () {
  const AWESOME_README_ROOT_ID = 'sindresorhus/awesome';
  const readme = await github.getReadme(AWESOME_README_ROOT_ID);
  const urls = await awesomeService.parseReadme(readme, true);
  const jobs = [];
  for (let url of urls) {
    jobs.push(await workQueue.add('awesome', { repo: new Awesome(url) }));
  }
  return jobs;
}

module.exports = {
  scrapeWebsite,
  getJob,
  getItem,
  search,
  fetchAwesomeRepo,
  fetchAwesomeFromRoot,
  workQueue,
  searchStats,
  randomItems
}
