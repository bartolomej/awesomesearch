const throng = require('throng');
const envalid = require('envalid');
const Queue = require('bull');
const logger = require('./logger')('redis-consumer');
const awesomeService = require('./services/awesome');
const websiteService = require('./services/website');
const Awesome = require('./models/awesome');
const Website = require('./models/website');
const { str, num } = envalid;

envalid.cleanEnv(process.env, {
  NODE_ENV: str({ default: 'production' }),
  REDIS_URL: str({ default: 'redis://127.0.0.1:6379' }),
  WEB_CONCURRENCY: num({ default: 1 }),
});

const redisUrl = process.env.REDIS_URL;
const workers = process.env.WEB_WORKERS;

const workQueue = new Queue('work', redisUrl);

function start () {

  /**
   * Process awesome repository scraping jobs.
   */
  workQueue.process('awesome', async job => {
    const repo = Awesome.fromObject(job.data.repo);
    logger.info(`Received job id:${job.id} uid:${repo.uid} in awesome queue`);
    const result = await awesomeService.getAwesomeListData(repo.uid);
    logger.info(`Finished job id:${job.id} in awesome queue`);
    return { ...repo, ...result };
  });

  /**
   * Process website scraping jobs.
   */
  workQueue.process('website', async job => {
    const website = Website.fromObject(job.data.website);
    logger.info(`Received job id:${job.id} url:${website.url} in website queue`);
    const html = await websiteService.getHtml(website.url);
    const result = await websiteService.getMetadata(html, website.url);
    logger.info(`Finished job id:${job.id} in awesome queue`);
    return { ...website, ...result };
  });
}

throng(({ workers, start }));
