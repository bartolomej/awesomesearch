import Queue from 'bull';
import IORedis from "ioredis";
import logger from "./logger";


// reuse redis connections
// https://github.com/OptimalBits/bull/blob/develop/PATTERNS.md

const client = createRedis();
const subscriber = createRedis();

function createRedis () {
  return new IORedis(process.env.REDIS_URL);
}

export function createQueue (name: string) {
  const log = logger(`${name}-queue`)
  const queue = new Queue(name, {
    createClient: function (type) {
      switch (type) {
        case 'client':
          return client;
        case 'subscriber':
          return subscriber;
        default:
          return createRedis();
      }
    },
    limiter: {
      max: 20,
      duration: 5000
    },
    defaultJobOptions: {
      removeOnComplete: true,
      attempts: 1,
    },
  })
  queue.on('stalled', job => {
    log.error(`Job#${job.id} stalled, processing again.`);
  });
  queue.on('failed', (job, err) => {
    log.error(`Job#${job.id} failed, with following reason`);
    log.error(err)
  });
  queue.on('error', err => {
    log.error(`Error in ${name}-queue: ${err}`);
  });
  return queue;
}
