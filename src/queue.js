const env = require('./env');
const Queue = require('bull');
const Redis = require('ioredis')
const client = new Redis(env.REDIS_URL);
const subscriber = new Redis(env.REDIS_URL);

// reuse redis connections
// https://github.com/OptimalBits/bull/blob/develop/PATTERNS.md
const opts = {
  createClient: function (type) {
    switch (type) {
      case 'client':
        return client;
      case 'subscriber':
        return subscriber;
      case 'bclient':
        return new Redis(env.REDIS_URL);
      default:
        throw new Error('Unexpected connection type: ', type);
    }
  },
  // limiter: {
  //   max: 20,
  //   duration: 5000
  // }
}

module.exports = function (name) {
  return new Queue(name, opts);
}
