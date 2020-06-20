const throng = require('throng');
const Queue = require('./queue');
const listService = require('./services/list');
const MetaService = require('./services/metadata');
const logger = require('./logger')('worker');
const env = require('./env');

const workQueue = Queue('work');

function start () {
  let imageService;

  if (!env.USE_MOCK_IMAGE_SERVICE) {
    const ImageService = require('./services/image');
    imageService = ImageService({
      cloudName: env.CLOUDINARY_CLOUD_NAME,
      apiKey: env.CLOUDINARY_API_KEY,
      apiSecret: env.CLOUDINARY_API_SECRET
    })
  } else {
    // initialize mock image service implementation
    const MockImageService = require('./tests/mocks/image');
    imageService = MockImageService();
  }

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

// handle critical uncaught errors

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Uncaught promise rejection: ' + reason);
});

process.on('uncaughtException', (err, origin) => {
  logger.error('Uncaught exception' + err + origin);
});
