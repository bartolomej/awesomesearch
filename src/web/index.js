const env = require('../env');
const throng = require('throng');
const { name } = require('../../package.json');
const { setQueues } = require('bull-board')
const OpenRoutes = require('./routes/open');
const AdminRoutes = require('./routes/admin');
const WebService = require('./service');
const memoryRepository = require('./repos/memorydb');
const linkRepository = require('./repos/link');
const listRepository = require('./repos/list');
const Queue = require('../queue');
const typeorm = require('./typeorm');
const logger = require('../logger')('web-index');
const { execute } = require('../utils');

async function start () {
  const listRepositoryDb = env.USE_MEMORY_DB ? memoryRepository() : listRepository;
  const linkRepositoryDb = env.USE_MEMORY_DB ? memoryRepository() : linkRepository;

  if (!env.USE_MEMORY_DB) {
    try {
      await typeorm.create();
    } catch (e) {
      logger.error(`Error while connecting to db: ${e}`);
      process.exit(1);
    }
  }

  // inject required dependencies
  const webService = WebService({
    listRepository: listRepositoryDb,
    linkRepository: linkRepositoryDb,
    workQueue: Queue('work')
  });

  // pass queues to 3rd party bull dashboard module
  setQueues([webService.workQueue]);

  try {
    /**
     * Initialise server with injected routes.
     */
    await require('./server')([
      OpenRoutes({
        webService,
        linkRepository: linkRepositoryDb,
        listRepository: listRepositoryDb
      }),
      AdminRoutes()
    ]);
    logger.info(`Web process ${process.pid} started 🙌`);
  } catch (e) {
    logger.error(`${name} encountered an error 🤕 \n${e.stack}`);
  }

  // build index with stored objects if using persistent db
  if (!env.USE_MEMORY_DB) {
    try {
      // async index build at 200 per data batch
      await execute(`Building search index`, webService.buildIndex(100));
    } catch (e) {
      logger.error(`Error while building search index: ${e}: ${e.description}`);
    }
  }
}

throng({
  workers: env.WEB_CONCURRENCY,
  lifetime: Infinity
}, start);


// handle critical uncaught errors

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Uncaught promise rejection', reason, promise);
});

process.on('uncaughtException', (err, origin) => {
  logger.error('Uncaught exception', err, origin);
});
