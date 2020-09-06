import winston from "winston";
import colors from 'colors';

export default function (service: string) {
  if (process.env.NODE_ENV === 'production') {
    return productionLogger(service);
  } else {
    return developmentLogger(service);
  }
};

function developmentLogger (service) {
  return {
    error: function (message) {
      console.error(colors.red(`[${service}]: ${message}`));
    },
    debug: function (message) {
      console.debug(colors.green(`[${service}]: ${message}`));
    },
    info: function (message) {
      console.info(`[${service}]: ${message}`);
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
