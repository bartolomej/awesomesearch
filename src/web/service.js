const logger = require('../logger')('web-service');
const websiteRepo = require('./repositories/website');
const awesomeRepo = require('./repositories/awesome');
const github = require('../gateways/github');
const awesomeService = require('../services/awesome');
const Queue = require('bull');

const redisUrl = process.env.REDIS_URL;
const workQueue = new Queue('work', redisUrl);

/**
 * Triggered when jobs are completed with resulting value.
 * COOL TOOL: https://github.com/vcapretz/bull-board
 */
workQueue.on('global', async (job, result) => {
  logger.info(`Job ${job.id}:${job.name} completed !`);
  if (job.name === 'awesome') {
    await awesomeRepo.saveAwesome(JSON.parse(result));
  } else if (job.name === 'website') {
    await websiteRepo.saveWebsite(JSON.parse(result));
  }
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
  return await workQueue.add('website', { url });
}

async function fetchAwesomeRepo (url) {
  return await workQueue.add('awesome', { url });
}

async function fetchAwesomeFromRoot () {
  const AWESOME_README_ROOT_ID = 'sindresorhus/awesome';
  const readme = await github.getReadme(AWESOME_README_ROOT_ID);
  const urls = await awesomeService.parseReadme(readme, true);
  const jobs = [];
  for (let url of urls) {
    jobs.add(await workQueue.add('awesome', { url }));
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
