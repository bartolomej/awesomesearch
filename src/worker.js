const throng = require('throng');
const Queue = require('./queue');
const listService = require('./services/list');
const imageService = require('./services/image');
const MetaService = require('./services/metadata');
const env = require('./env');

const workQueue = Queue('work');

function start () {
  imageService.init(
    env.CLOUDINARY_CLOUD_NAME,
    env.CLOUDINARY_API_KEY,
    env.CLOUDINARY_API_SECRET,
  );

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

throng(({ workers: env.WEB_WORKERS, start }));
