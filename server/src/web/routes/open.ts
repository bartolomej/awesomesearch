import express from 'express';
import { WebServiceInt } from "../service";
import {
  LinkRepositoryInt,
  ListRepositoryInt,
  SearchLogRepositoryInt
} from "../repos/repos";
import { MetaServiceInt } from "../../services/metadata";
import * as utils from './utils';

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


  router.get('/link/search',
    searchFetchRules(),
    utils.validateReqParams,
    async (req, res, next) => {
      const { q, page, limit } = req.query;
      try {
        const [links, count] = await webService.searchLinks({
          query: q,
          page: page ? parseInt(page) : 0,
          limit: limit ? parseInt(limit) : 15,
          useragent: req.useragent.source
        });
        const lists = await Promise.all(
          links.map(l => listRepository.get(l.source))
        );
        res.send(utils.serializeSearchResult(
          links.map((l, i) => utils.serializeLink(l, lists[i])),
          { total_results: count }
        ));
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
        .map(l => utils.serializeLink(l)));
    } catch (e) {
      next(e);
    }
  });

  router.get('/link/:uid', async (req, res, next) => {
    try {
      const link = await linkRepository.get(req.params.uid);
      res.send({
        ...utils.serializeLink(link),
        // @ts-ignore
        source: await listRepository.get(link.source)
      });
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
        res.send(utils.serializeSearchResult(searchRes.results, {
          page: searchRes.page,
          next: searchRes.next
        }));
      } catch (e) {
        next(e);
      }
    }
  );

  router.get('/list',
    listFetchRules(),
    utils.validateReqParams,
    async (req, res, next) => {
      const { limit, page } = req.query;
      try {
        const [lists, count] = await Promise.all([
          listRepository.getAll(limit || 10, page || 0),
          listRepository.getCount()
        ]);
        // append link count to result object
        res.send(utils.serializeSearchResult(
          await Promise.all(lists.map(async l => ({
            ...utils.serializeList(l),
            link_count: await linkRepository.getCount(l.uid)
          }))),
          { total_results: count }
        ));
      } catch (e) {
        next(e);
      }
    }
  );

  router.get('/list/:uid', async (req, res, next) => {
    try {
      res.send({
        ...utils.serializeList(await listRepository.get(req.params.uid)),
        link_count: await linkRepository.getCount(req.params.uid),
      });
    } catch (e) {
      next(e);
    }
  });

  router.get('/list/:uid/link',
    listFetchRules(),
    utils.validateReqParams,
    async (req, res, next) => {
      const { limit, page } = req.query;
      try {
        const links = await linkRepository.getAll(
          limit || 10,
          page || 0,
          req.params.uid
        );
        res.send(links.map(l => utils.serializeLink(l)));
      } catch (e) {
        next(e);
      }
    }
  );

  router.get('/list/:uid/link/search',
    searchFetchRules(),
    utils.validateReqParams,
    async (req, res, next) => {
      const { q, page, limit } = req.query;
      try {
        const [links, count] = await webService.searchLinks({
          query: q,
          page: page ? parseInt(page) : 0,
          limit: limit ? parseInt(limit) : 15,
          listUid: req.params.uid,
          useragent: req.useragent.source
        });
        res.send(utils.serializeSearchResult(
          links.map(l => utils.serializeLink(l)),
          { total_results: count }
        ))
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

  router.get('/stats', async (req, res, next) => {
    const [
      link_count,
      list_count,
      total_search_count
    ] = await Promise.all([
      linkRepository.getCount(),
      listRepository.getCount(),
      searchLogRepository.getTotalCount(),
    ]);
    try {
      res.send({
        link_count,
        list_count,
        total_search_count,
      })
    } catch (e) {
      next(e);
    }
  });

  return router;
}
