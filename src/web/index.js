const env = require('../env');
const throng = require('throng');
const { name } = require('../../package.json');
const { setQueues } = require('bull-board')
const routes = require('./routes');
const WebService = require('./service');
const memoryRepository = require('./repos/memorydb');
const linkRepository = require('./repos/link');
const listRepository = require('./repos/list');
const Queue = require('../queue');
const typeorm = require('./typeorm');

async function start () {
  const listRepositoryDb = env.USE_MEMORY_DB ? memoryRepository() : listRepository;
  const linkRepositoryDb = env.USE_MEMORY_DB ? memoryRepository() : linkRepository;

  if (!env.USE_MEMORY_DB) {
    await typeorm.create();
  }

  // inject required dependencies
  const webService = WebService({
    listRepository: listRepositoryDb,
    linkRepository: linkRepositoryDb,
    workQueue: Queue('work')
  });

  // build index with stored objects
  if (!env.USE_MEMORY_DB) {
    try {
      await webService.buildIndex();
      console.log('Index build complete');
    } catch (e) {
      console.error(`Error building index: ${e}`)
    }

  }

  try {
    setQueues([webService.workQueue]);
    await require('./server')([
      routes({
        webService,
        linkRepository: linkRepositoryDb,
        listRepository: listRepositoryDb
      })
    ]);
    console.log(`Web process ${process.pid} started 🙌`);
  } catch (e) {
    console.error(`${name} encountered an error 🤕 \n${e.stack}`);
  }
}

throng({
  workers: env.WEB_CONCURRENCY,
  lifetime: Infinity
}, start);
