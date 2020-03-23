const winston = require('winston');
const colors = require('colors');
const { env } = require('./utils');

module.exports = function (service) {
  if (env.isProduction) {
    return productionLogger(service);
  } else {
    return developmentLogger(service);
  }
};

function developmentLogger (service) {
  return {
    error: function (message) {
      console.log(colors.red(message));
    },
    debug: function (message) {
      console.log(colors.green(message));
    },
    info: function (message) {
      console.log(message);
    }
  }
}

function productionLogger (service) {
  return winston.createLogger({
    format: winston.format.json(),
    defaultMeta: { service },
    transports: [new winston.transports.Console()]
  });
}
