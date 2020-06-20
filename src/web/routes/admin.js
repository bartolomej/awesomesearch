const router = require('express').Router();
const githubService = require('../../services/github');
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
    res.send(await searchLogRepo.getCountByQuery());
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
