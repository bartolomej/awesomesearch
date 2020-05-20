const throng = require('throng');
const envalid = require('envalid');
const Queue = require('./queue');
const listService = require('./services/list');
const imageService = require('./services/image');
const MetaService = require('./services/metadata');
const { str, num } = envalid;

envalid.cleanEnv(process.env, {
  REDIS_URL: str({ default: 'redis://127.0.0.1:6379' }),
  WEB_WORKERS: num({ default: 2 }),
});

const workers = process.env.WEB_WORKERS;
const workQueue = Queue('work');

function start () {
  imageService.init();
  const linkService = MetaService({ imageService });

  /**
   * Process awesome repository scraping jobs.
   */
  workQueue.process('list', async job => {
    return await listService.getAwesomeListData(job.data.url);
  });

  /**
   * Process website scraping jobs.
   */
  workQueue.process('link', async job => {
    return await linkService.getMetadata(job.data.url, job.data.source);
  });

  console.log(`Worker ${process.pid} started 🙌`);
}

throng(({ workers, start }));
