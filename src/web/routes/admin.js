const router = require('express').Router();
const githubService = require('../../services/github');
const { UI } = require('bull-board');
const { validateReqParams } = require('./utils');
const logRepo = require('../repos/searchlog');
const { query } = require('express-validator');

const statsFetchRules = () => ([
  query(['start', 'end']).optional().isString(), // valid format: dd.mm.yyyy
  query(['page', 'limit']).optional().isNumeric(),
  query('group').isIn(['date', 'query'])
]);

const postJobRules = () => ([
  query('url').isURL().optional()
])

function RestApi ({ webService }) {

  // https://github.com/vcapretz/bull-board
  router.use('/admin/queue', UI)

  router.get('/admin/search', async (req, res) => {
    res.send(await logRepo.getSortedByDate());
  });

  router.get('/admin/search/stats',
    statsFetchRules(),
    validateReqParams,
    async (req, res, next) => {
      const { start, end, page, limit } = req.query;
      try {
        if (req.query.group === 'query') {
          res.send(await logRepo.getCountByQuery(start, end, page || 0, limit || 10));
        } else if (req.query.group === 'date') {
          res.send(await logRepo.getCountByDate(start, end, page || 0, limit || 10));
        }
      } catch (e) {
        next(e);
      }
    }
  );

  router.get('/admin/stats', async (req, res, next) => {
    try {
      const rateLimit = await githubService.rateLimit();
      res.send({ rate_limit: rateLimit })
    } catch (e) {
      next(e);
    }
  });

  router.post('/admin/list',
    postJobRules(),
    validateReqParams,
    async (req, res, next) => {
      try {
        if (req.query.url) {
          res.send(await webService.scrapeList(req.query.url));
        } else {
          res.send(await webService.scrapeFromRoot());
        }
      } catch (e) {
        next(e);
      }
    }
  );

  return router;
}

module.exports = RestApi;
