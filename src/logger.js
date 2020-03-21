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
    error: function (message, error) {
      console.log(colors.red(message, error));
    },
    debug: function (message, error) {
      console.log(colors.green(message, error));
    },
    info: function (message, error) {
      console.log(message, error);
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
