const winston = require('winston');
const colors = require('colors');

module.exports = function (service) {
  if (process.env.isProduction) {
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
