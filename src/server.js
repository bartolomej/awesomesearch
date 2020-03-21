const { env } = require("./utils");
const express = require('express');
const app = express();
const cors = require('cors');
const logger = require('./logger')('root');


module.exports = async function (routes = []) {

  if (!env.isProduction) {
    // development logger
    app.use(require('morgan')('dev'));
  }

  // disable "powered by" headers
  app.disable('x-powered-by');
  // allow cors
  app.use(cors());
  // express json body parser
  app.use(express.json());
  // express url parser
  app.use(express.urlencoded({ extended: false }));

  // root endpoint
  app.get('/', (req, res, next) => res.send('Server is running 🙌'));

  // setup module apis
  for (let route of routes) app.use(route);

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    res.status(404).send({
      name: 'NotFoundError',
      message: `Path '${req.path}' not found`
    })
  });

  // express error handler
  app.use((err, req, res, next) => {
    const details = {
      stack: err.stack,
      errorObject: err
    };
    const error = {
      name: err.name,
      message: err.message,
      description: err.description,
      details: !env.isProduction ? details : undefined
    };
    logger.debug('debug', 'Error in response', error);
    res.status(err.statusCode || 400).send(error);
  });

  // start the server on port <PORT> or 3000
  app.listen(env.PORT, error => {
    if (error) throw error;
    logger.info(`Server listening on port ${env.PORT} 🙌`);
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Uncaught promise rejection', reason, promise);
  });

  process.on('uncaughtException', (err, origin) => {
    logger.error('Uncaught exception', err, origin);
  });

};
