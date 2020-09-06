import logger from "../logger";
import { createQueue } from "../queue";
import { workerEnv } from "../env";
import { join } from 'path';

const env = workerEnv();
const listQueue = createQueue('list');
const linkQueue = createQueue('link');
const log = logger('worker');

function start () {

  /**
   * Process awesome repository scraping jobs.
   */
  listQueue.process(
    env.LIST_WORKER_CONCURRENCY,
    join(__dirname, 'processors/list.js')
  );

  /**
   * Process website scraping jobs.
   */
  linkQueue.process(
    env.LINK_WORKER_CONCURRENCY,
    join(__dirname, 'processors/link.js')
  );

  log.info(`Worker process ${process.pid} started 🙌`);
}

// handle critical uncaught errors

process.on('unhandledRejection', (reason) => {
  log.error('Uncaught promise rejection: ' + reason);
});

process.on('uncaughtException', (err, origin) => {
  log.error('Uncaught exception' + err + origin);
});

start();
