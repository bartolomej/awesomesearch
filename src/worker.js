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

function start () {
  const awesomeQueue = new Queue('awesome', redisUrl);
  const websiteQueue = new Queue('website', redisUrl);

  logger.info('Worker started');

  awesomeQueue.process(async job => {
    const url = job.data.url;
    logger.info(`Received job id:${job.id} data:${url} in awesome queue`);
    const result = await awesomeService.getAwesomeListData(url);
    logger.info(`Finished job id:${job.id} in awesome queue`);
    return result;
  });

  websiteQueue.process(async job => {
    const url = job.data.url;
    logger.info(`Received job id:${job.id} data:${url} in website queue`);
    const html = await websiteService.getHtml(url);
    const result = await websiteService.getMetadata(html, url);
    logger.info(`Finished job id:${job.id} in awesome queue`);
    return result;
  });
}

throng(({ workers, start }));
