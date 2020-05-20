const { red } = require('colors');
const throng = require('throng');
const { name } = require('../../package.json');
const envalid = require('envalid');
const { str, bool, num } = envalid;
const { setQueues } = require('bull-board')
const routes = require('./routes');
const WebService = require('./service');
const memoryRepository = require('./repos/memorydb');
const Queue = require('../queue');

const WORKERS = process.env.WEB_CONCURRENCY;

envalid.cleanEnv(process.env, {
  PORT: num({ default: 3000 }),
  TEST_DATA: bool({ default: false }),
  REDIS_URL: str({ default: 'redis://127.0.0.1:6379' }),
  WEB_CONCURRENCY: num({ default: 1 }),
  CLOUDINARY_CLOUD_NAME: str(),
  CLOUDINARY_API_KEY: str(),
  CLOUDINARY_API_SECRET: str()
});

function start () {

  // inject required dependencies
  const webService = WebService({
    listRepository: memoryRepository(),
    linkRepository: memoryRepository(),
    workQueue: Queue('work')
  });

  try {
    setQueues([webService.workQueue]);
    require('./server')([
      routes({ webService })
    ]);
    console.log(`Web process ${process.pid} started 🙌`);
  } catch (e) {
    console.log(red(`${name} encountered an error 🤕 \n${e.stack}`));
  }
}

throng({
  workers: WORKERS,
  lifetime: Infinity
}, start);
