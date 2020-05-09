const logger = require('../logger')('web-service');
const websiteRepo = require('./repositories/website');
const awesomeRepo = require('./repositories/awesome');
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
  cache: true
});

/**
 * Triggered when jobs are completed with resulting value.
 * COOL TOOL: https://github.com/vcapretz/bull-board
 */
workQueue.on('global:completed', async (jobId, result) => {
  const job = await getJob(jobId);
  logger.info(`Job ${job.id}:${job.name} completed !`);
  if (job.name === 'awesome') {
    const repo = new Awesome();
    repo.assign(JSON.parse(result))
    // add serialized string data to search index
    index.add(repo.uid, repo.serializeToIndex());
    for (let url of repo.urls) {
      await workQueue.add('website', { website: new Website(url) });
    }
  } else if (job.name === 'website') {
    const website = new Website();
    website.assign(JSON.parse(result))
    // add serialized string data to search index
    await websiteRepo.saveWebsite(website)
    index.add(website.uid, website.serializeToIndex());
  }
});

async function search (query, page = true) {
  const results = await index.search(query, {
    limit: 15, page
  });
  console.log(results)
  return results.result.map(id => (
    websiteRepo.getWebsite(id) ||
    awesomeRepo.getAwesome(id)
  ));
}

async function getJob (id) {
  const job = await workQueue.getJob(id);
  return await parseJob(job);
}

async function getAllJobs () {
  const statuses = ['waiting', 'active', 'completed', 'failed', 'delayed'];
  const awesomeJobs = await workQueue.getJobs(statuses);
  return await Promise.all(awesomeJobs.map(job => parseJob(job, true)))
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
    jobs.add(await workQueue.add('awesome', { repo: new Awesome(url) }));
  }
  return jobs;
}

async function parseJob (job, minified = false) {
  return minified ? {
    id: job.id,
    name: job.name,
    state: await job.getState(),
    progress: job._progress,
    failed_reason: job.failedReason,
    timestamp: job.timestamp
  } : job
}

module.exports = {
  scrapeWebsite,
  getJob,
  search,
  getAllJobs,
  fetchAwesomeRepo,
  fetchAwesomeFromRoot,
  workQueue
}
