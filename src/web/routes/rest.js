const router = require('express').Router();
const metaService = require('../../services/metadata')({ imageService: null });
const utils = require('./utils');

function RestApi ({ webService, listRepository, linkRepository }) {

  router.get('/list/:uid', async (req, res, next) => {
    try {
      res.send(utils.serializeList(await webService.getItem(req.params.uid, 'list')));
    } catch (e) {
      next(e);
    }
  });

  router.get('/link/:uid', async (req, res, next) => {
    try {
      res.send(utils.serializeLink(await webService.getItem(req.params.uid, 'link')));
    } catch (e) {
      next(e);
    }
  });

  router.get('/list', async (req, res, next) => {
    try {
      res.send((await listRepository.getAll(
        req.query.limit || 10,
        req.query.page || 0
      )).map(utils.serializeList))
    } catch (e) {
      next(e);
    }
  });

  router.get('/list/:uid/link', async (req, res, next) => {
    try {
      res.send((await linkRepository.getAll(
        req.query.limit || 10,
        req.query.page || 0,
        req.params.uid
      )).map(utils.serializeLink));
    } catch (e) {
      next(e);
    }
  });

  /**
   * Returns website metadata given url in query param.
   */
  router.get('/meta', async (req, res, next) => {
    try {
      if (req.query.url) {
        const html = await metaService.getHtml(req.query.url);
        const website = await metaService.parseHtml(html, req.query.url);
        if (req.headers.accept.indexOf('text/html') === 0) {
          res.render('metadata', website);
        } else {
          res.send(website);
        }
      } else {
        next(new Error('Please provide website url'));
      }
    } catch (e) {
      next(e);
    }
  });

  router.get('/random', async (req, res, next) => {
    try {
      res.send((await linkRepository.getRandomObject(req.query.n || 6))
        .map(e => e.serialize()));
    } catch (e) {
      next(e);
    }
  });

  router.get('/search', async (req, res, next) => {
    try {
      if (req.query.q) {
        const searchRes = await webService.search({
          query: req.query.q,
          page: req.query.p || true,
          limit: req.query.limit ? parseInt(req.query.limit) : 15
        });
        res.send(utils.serializeSearchResult(searchRes));
      } else {
        // return empty array if q param not provided or is empty
        res.send([]);
      }
    } catch (e) {
      next(e);
    }
  });

  router.get('/stats', async (req, res, next) => {
    try {
      const stats = await webService.getStats();
      res.send({
        link_count: stats.linkCount,
        list_count: stats.listCount,
        search_index: stats.searchIndex
      })
    } catch (e) {
      next(e);
    }
  });

  /**
   * Dispatch awesome job.
   */
  router.post('/list', async (req, res, next) => {
    try {
      if (req.query.url) {
        res.send(await webService.scrapeList(req.query.url));
      } else {
        res.send(await webService.scrapeFromRoot());
      }
    } catch (e) {
      next(e);
    }
  });

  return router;
}

module.exports = RestApi;
