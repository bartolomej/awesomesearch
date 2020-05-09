const throng = require('throng');
const envalid = require('envalid');
const Queue = require('bull');
const logger = require('./logger')('redis-consumer');
const awesomeService = require('./services/awesome');
const websiteService = require('./services/website');
const { str, num } = envalid;

module.exports.env = envalid.cleanEnv(process.env, {
  NODE_ENV: str({ default: 'production' }),
  REDIS_URL: str({ default: 'redis://127.0.0.1:6379' }),
  WEB_CONCURRENCY: num({ default: 1 }),
});

const redisUrl = process.env.REDIS_URL;
const workers = process.env.WEB_WORKERS;

const workQueue = new Queue('work', redisUrl);

function start () {

  logger.info('Worker started');

  workQueue.process('awesome', async job => {
    const repo = job.data.repo;
    logger.info(`Received job id:${job.id} uid:${repo.uid} in awesome queue`);
    const result = await awesomeService.getAwesomeListData(repo.url);
    logger.info(`Finished job id:${job.id} in awesome queue`);
    return { ...repo, ...result };
  });

  workQueue.process('website', async job => {
    const { url } = job.data.website;
    logger.info(`Received job id:${job.id} url:${url} in website queue`);
    const html = await websiteService.getHtml(url);
    const result = await websiteService.getMetadata(html, url);
    logger.info(`Finished job id:${job.id} in awesome queue`);
    return { ...job.data.website, ...result };
  });
}

throng(({ workers, start }));
