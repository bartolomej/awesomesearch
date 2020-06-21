const router = require('express').Router();
const githubService = require('../../services/github');
const AwesomeError = require('../../error');
const { UI } = require('bull-board');
const searchLogRepo = require('../repos/searchlog');

function RestApi () {

  // https://github.com/vcapretz/bull-board
  router.get('/admin/queues', UI)

  router.get('/admin/dashboard', async (req, res, next) => {
    res.render('dash');
  });

  router.get('/admin/log', async (req, res, next) => {
    res.send(await searchLogRepo.getSortedByDate());
  });

  router.get('/admin/log/stats', async (req, res, next) => {
    if (req.query.group === 'query') {
      res.send(await searchLogRepo.getCountByQuery());
    }
    else if (req.query.group === 'date') {
      res.send(await searchLogRepo.getCountByDate());
    }
    else {
      next(new AwesomeError('Required param: group'))
    }
  });

  router.get('/admin/stats', async (req, res, next) => {
    try {
      const rateLimit = await githubService.rateLimit();
      res.send({
        rate_limit: rateLimit
      })
    } catch (e) {
      next(e);
    }
  });

  return router;
}

module.exports = RestApi;
