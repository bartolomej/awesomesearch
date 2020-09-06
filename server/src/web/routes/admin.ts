import { WebServiceInt } from "../service";
import { query } from "express-validator";
import { GithubServiceInt } from "../../services/github";
import { SearchLogRepositoryInt } from "../repos/repos";

const router = require('express').Router();
const { UI } = require('bull-board');
const { validateReqParams } = require('./utils');

const statsFetchRules = () => ([
  query(['start', 'end']).optional().isString(), // valid format: dd.mm.yyyy
  query(['page', 'limit']).optional().isNumeric(),
  query('group').isIn(['date', 'query'])
]);

const postJobRules = () => ([
  query('url').isURL().optional()
])

interface AdminRoutesProps {
  webService: WebServiceInt;
  githubService: GithubServiceInt;
  searchLogRepository: SearchLogRepositoryInt;
}

export default function AdminRoutes ({
  webService,
  githubService,
  searchLogRepository
}: AdminRoutesProps) {

  // https://github.com/vcapretz/bull-board
  router.use('/admin/queue', UI)

  router.get('/admin/search', async (req, res) => {
    res.send(await searchLogRepository.getSortedByDate());
  });

  router.get('/admin/search/stats',
    statsFetchRules(),
    validateReqParams,
    async (req, res, next) => {
      const { start, end, page, limit } = req.query;
      try {
        if (req.query.group === 'query') {
          res.send(await searchLogRepository.getCountByQuery({
            start,
            end,
            page: page || 0,
            limit: limit || 10
          }));
        } else if (req.query.group === 'date') {
          res.send(await searchLogRepository.getCountByDate({
            start,
            end,
            page: page || 0,
            limit: limit || 10
          }));
        }
      } catch (e) {
        next(e);
      }
    }
  );

  router.get('/admin/stats', async (req, res, next) => {
    try {
      const rateLimit = await githubService.getRateLimit();
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
          res.send(await webService.queueList(req.query.url));
        } else {
          res.send(await webService.queueFromRoot());
        }
      } catch (e) {
        next(e);
      }
    }
  );

  return router;
}
