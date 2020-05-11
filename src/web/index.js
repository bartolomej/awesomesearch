const { red } = require('colors');
const throng = require('throng');
const { name } = require('../../package.json');
const envalid = require('envalid');
const { str, bool, num } = envalid;
const { workQueue } = require('./service');
const { setQueues } = require('bull-board')

const WORKERS = process.env.WEB_CONCURRENCY;

envalid.cleanEnv(process.env, {
  PORT: num({ default: 3000 }),
  TEST_DATA: bool({ default: false }),
  REDIS_URL: str({ default: 'redis://127.0.0.1:6379' }),
  WEB_CONCURRENCY: num({ default: 1 })
});

const routes = [
  require('./routes')
];

function start () {
  try {
    setQueues([workQueue]);
    require('./server')(routes);
    console.log(`Web process ${process.pid} started 🙌`);
  } catch (e) {
    console.log(red(`${name} encountered an error 🤕 \n${e.stack}`));
  }
}

throng({
  workers: WORKERS,
  lifetime: Infinity
}, start);
