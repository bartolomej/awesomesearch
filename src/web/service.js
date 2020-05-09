const logger = require('../logger')('web-service');
const websiteRepo = require('./repositories/website');
const awesomeRepo = require('./repositories/awesome');
const github = require('../gateways/github');
const awesomeService = require('../services/awesome');
const Queue = require('bull');

const redisUrl = process.env.REDIS_URL;
const awesomeQueue = new Queue('awesome', redisUrl);
const websiteQueue = new Queue('website', redisUrl);

/**
 * Triggered when jobs are completed with resulting value.
 * COOL TOOL: https://github.com/vcapretz/bull-board
 */
awesomeQueue.on('global:completed', async (jobId, result) => {
  logger.info(`Awesome job ${jobId} completed !`);
  await awesomeRepo.saveAwesome(JSON.parse(result));
});

websiteQueue.on('global:completed', async (jobId, result) => {
  logger.info(`Website job ${jobId} completed !`);
  await websiteRepo.saveWebsite(JSON.parse(result));
});

async function parseJob (job, minified = false) {
  return minified ? {
    id: job.id,
    state: await job.getState(),
    progress: job._progress,
    failed_reason: job.failedReason,
    timestamp: job.timestamp
  } : job
}

async function getJob (queue, id) {
  if (queue === 'awesome') {
    const job = await awesomeQueue.getJob(id);
    return await parseJob(job);
  } else if (queue === 'website') {
    const job = await websiteQueue.getJob(id);
    return await parseJob(job);
  } else {
    throw new Error('Queue not found');
  }
}

async function getAllJobs () {
  const statuses = ['waiting', 'active', 'completed', 'failed', 'delayed'];
  const awesomeJobs = await awesomeQueue.getJobs(statuses);
  const websiteJobs = await websiteQueue.getJobs(statuses);
  return {
    awesome: await Promise.all(awesomeJobs.map(job => parseJob(job, true))),
    website: await Promise.all(websiteJobs.map(job => parseJob(job, true)))
  };
}

async function scrapeWebsite (url) {
  return await websiteQueue.add({ url });
}

async function fetchAwesomeRepo (url) {
  return await awesomeQueue.add({ url });
}

async function fetchAwesomeFromRoot () {
  const AWESOME_README_ROOT_ID = 'sindresorhus/awesome';
  const readme = await github.getReadme(AWESOME_README_ROOT_ID);
  const urls = await awesomeService.parseReadme(readme, true);
  const jobs = [];
  for (let url of urls) {
    jobs.add(await awesomeQueue.add({ url }));
  }
  return jobs;
}

module.exports = {
  scrapeWebsite,
  getJob,
  getAllJobs,
  fetchAwesomeRepo,
  fetchAwesomeFromRoot
}
