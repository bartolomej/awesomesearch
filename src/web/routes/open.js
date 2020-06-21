const router = require('express').Router();
const metaService = require('../../services/metadata')({ imageService: null });
const searchLogRepo = require('../repos/searchlog');
const SearchLog = require('../../models/searchlog');
const utils = require('./utils');
const { query } = require('express-validator');
const AwesomeError = require('../../error');

// REQUEST PARAMS VALIDATION RULES

const listFetchRules = () => ([
  query('limit').isNumeric().optional(),
  query('page').isNumeric().optional()
]);

const metaFetchRules = () => ([
  query('url').isURL(),
]);

const searchFetchRules = () => ([
  query('limit').isNumeric().optional(),
  query('page').isNumeric().optional(),
  query('q').isString()
]);

function RestApi ({ webService, listRepository, linkRepository }) {

  router.get('/', (req, res) => {
    res.send('AwesomeSearch API is running 🙌')
  });

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

  router.get('/list',
    listFetchRules(),
    utils.validateReqParams,
    async (req, res, next) => {
      const { limit, page } = req.query;
      try {
        const lists = await listRepository.getAll(limit || 10, page || 0);
        // append link count to result object
        res.send(await Promise.all(lists.map(async l => ({
          ...utils.serializeList(l),
          link_count: await linkRepository.getCount(l.uid)
        }))));
      } catch (e) {
        next(e);
      }
    }
  );

  router.get('/list/:uid/link',
    listFetchRules(),
    utils.validateReqParams,
    async (req, res, next) => {
      const { limit, page } = req.query;
      try {
        const links = await linkRepository.getAll(limit || 10, page || 0, req.params.uid);
        if (links.length === 0) {
          return next(
            new AwesomeError(
              AwesomeError.types.NOT_FOUND,
              `No links found for requested list`
            )
          );
        }
        res.send(links.map(utils.serializeLink));
      } catch (e) {
        next(e);
      }
    }
  );

  /**
   * Returns website metadata given url in query param.
   */
  router.get('/meta',
    metaFetchRules(),
    utils.validateReqParams,
    async (req, res, next) => {
      try {
        const html = await metaService.getHtml(req.query.url);
        const website = await metaService.parseHtml(html, req.query.url);
        res.send(website);
      } catch (e) {
        next(e);
      }
    }
  );

  router.get('/link/random', async (req, res, next) => {
    try {
      res.send((await linkRepository.getRandomObject(req.query.n || 6))
        .map(utils.serializeLink));
    } catch (e) {
      next(e);
    }
  });

  router.get('/suggest',
    searchFetchRules(),
    utils.validateReqParams,
    async (req, res, next) => {
    const {q, page, limit} = req.query;
      try {
        const searchRes = await webService.suggest({
          query: q, page: page || true,
          limit: limit ? parseInt(limit) : 10
        });
        res.send(searchRes);
      } catch (e) {
        next(e);
      }
    }
  );

  router.get('/search',
    searchFetchRules(),
    utils.validateReqParams,
    async (req, res, next) => {
      const { q, p, limit } = req.query;
      try {
        const searchRes = await webService.search({
          query: q, page: p || true,
          limit: limit ? parseInt(limit) : 15
        });
        res.send(utils.serializeSearchResult(searchRes));
        // log search to db
        await searchLogRepo.save(new SearchLog(q, req.useragent.source))
      } catch (e) {
        next(e);
      }
    }
  );

  router.get('/stats', async (req, res, next) => {
    try {
      const stats = await webService.getStats();
      res.send(utils.serializeStats(stats))
    } catch (e) {
      next(e);
    }
  });

  return router;
}

module.exports = RestApi;
