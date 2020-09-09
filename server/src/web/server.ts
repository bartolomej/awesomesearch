import logger from "../logger";
import express from 'express';

const cors = require('cors');
const path = require('path');
const useragent = require('express-useragent');

export default async function Server (routes = []) {
  const log = logger('server');
  const app = express();

  // @ts-ignore
  if (!process.env.NODE_ENV === 'development') {
    // development logger
    app.use(require('morgan')('dev'));
  }

  app.use(useragent.express());
  app.use(express.static(path.join(__dirname, 'public')));

  // disable "powered by" headers
  app.disable('x-powered-by');
  // allow cors
  app.use(cors());
  // express json body parser
  app.use(express.json());
  // express url parser
  app.use(express.urlencoded({ extended: false }));

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
  // NOTE: next param is required !
  // https://expressjs.com/en/guide/error-handling.html#writing-error-handlers
  app.use((err, req, res, next) => {
    log.debug(`Error in response: ${err}`);
    res.status(err.statusCode || 400).send({
      message: err.message
    });
  });

  // start the server on port <PORT> or 3000
  app.listen(process.env.PORT, error => {
    if (error) throw error;
    log.info(`Server listening on port ${process.env.PORT} 🙌`);
  });

};
