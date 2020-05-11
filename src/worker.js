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
  REDIS_URL: str({ default: 'redis://127.0.0.1:6379' }),
  WEB_WORKERS: num({ default: 2 }),
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
    const result = await awesomeService.getAwesomeListData(repo.uid);
    return { ...repo, ...result };
  });

  /**
   * Process website scraping jobs.
   */
  workQueue.process('website', async job => {
    const website = Website.fromObject(job.data.website);
    const html = await websiteService.getHtml(website.url);
    const result = await websiteService.getMetadata(html, website.url);
    return { ...website, ...result };
  });

  console.log(`Worker ${process.pid} started 🙌`);
}

throng(({ workers, start }));
