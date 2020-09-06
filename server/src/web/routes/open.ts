import express from 'express';
import SearchLog from "../../models/searchlog";
import { WebServiceInt } from "../service";
import {
  LinkRepositoryInt,
  ListRepositoryInt,
  SearchLogRepositoryInt
} from "../repos/repos";
import { MetaServiceInt } from "../../services/metadata";
import { ERROR_MSG_NOT_FOUND } from "../../constants";

const utils = require('./utils');
const { query } = require('express-validator');

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

interface OpenRoutesParams {
  webService: WebServiceInt;
  metaService: MetaServiceInt;
  listRepository: ListRepositoryInt;
  linkRepository: LinkRepositoryInt;
  searchLogRepository: SearchLogRepositoryInt
}

export default function OpenRoutes ({
  webService,
  metaService,
  listRepository,
  linkRepository,
  searchLogRepository
}: OpenRoutesParams) {
  const router = express.Router();

  router.get('/', (req, res) => {
    res.send('AwesomeSearch API is running 🙌')
  });

  router.get('/list/:uid', async (req, res, next) => {
    try {
      res.send(utils.serializeList(await webService.getList(req.params.uid)));
    } catch (e) {
      next(e);
    }
  });

  router.get('/link/:uid', async (req, res, next) => {
    try {
      res.send(utils.serializeLink(await webService.getLink(req.params.uid)));
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
          return next(new Error(ERROR_MSG_NOT_FOUND));
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
        const html = await metaService.fetchHtml(req.query.url);
        const website = await metaService.getParsedWebsite(html, req.query.url);
        res.send(website);
      } catch (e) {
        next(e);
      }
    }
  );

  router.get('/link/random', async (req, res, next) => {
    const { n } = req.query;
    try {
      // @ts-ignore
      res.send((await linkRepository.getRandomObject(n ? parseInt(n) : 6))
        .map(utils.serializeLink));
    } catch (e) {
      next(e);
    }
  });

  router.get('/suggest',
    searchFetchRules(),
    utils.validateReqParams,
    async (req, res, next) => {
      const { q, page, limit } = req.query;
      try {
        const searchRes = await webService.suggest(q,
          page || true,
          limit ? parseInt(limit) : 10
        );
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
        const searchRes = await webService.search(q,
          p ? parseInt(p) : 0,
          limit ? parseInt(limit) : 15
        );
        res.send(utils.serializeSearchResult(searchRes));
        // log search to db
        await searchLogRepository.save(new SearchLog(q, req.useragent.source))
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
