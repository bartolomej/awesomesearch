const throng = require('throng');
const envalid = require('envalid');
const Queue = require('./queue');
const awesomeService = require('./services/awesome');
const websiteService = require('./services/metadata');
const Awesome = require('./models/awesome');
const Website = require('./models/link');
const { str, num } = envalid;

envalid.cleanEnv(process.env, {
  REDIS_URL: str({ default: 'redis://127.0.0.1:6379' }),
  WEB_WORKERS: num({ default: 2 }),
});

const workers = process.env.WEB_WORKERS;
const workQueue = Queue('work');

function start () {

  /**
   * Process awesome repository scraping jobs.
   */
  workQueue.process('awesome', async job => {
    const repo = Awesome.fromObject(job.data.repo);
    const result = await awesomeService.getAwesomeListData(repo.getRepository(), repo.getUser());
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
