const router = require('express').Router();
const metaService = require('../services/metadata')({ imageService: null });

function Routes ({ webService, listRepository, linkRepository }) {

  // root endpoint
  router.get('/', (req, res, next) => {
    res.render('root', {
      host: 'https://api.awesomesearch.in',
      endpoints: [
        {
          path: '/stats',
          examplePath: '/stats',
          description: 'Returns data statistics.'
        },
        {
          path: '/random',
          examplePath: '/random',
          description: 'Returns random indexed links.'
        },
        {
          path: '/list?limit={objects_per_page}&page={page_index}',
          examplePath: '/list',
          description: 'Returns indexed lists.'
        },
        {
          path: '/list/{list_uid}',
          examplePath: '/list/amnashanwar.awesome-portfolios',
          description: 'Returns information about list object.'
        },
        {
          path: '/link/{link_uid}',
          examplePath: '/link/shewolfe.co',
          description: 'Returns information about link object.'
        },
        {
          path: '/search?q={query_string}&p={page_index}&limit={items_per_page}',
          examplePath: '/search?q=Awesome',
          description: 'Returns search results sorted by relevance.',
        },
        {
          path: '/meta?url={website_url}',
          examplePath: '/meta?url=https://www.github.com',
          description: 'Returns website metadata.'
        },
      ]
    })
  });

  router.get('/list/:uid', async (req, res, next) => {
    try {
      res.send((await webService.getItem(req.params.uid, 'list')).serialize());
    } catch (e) {
      next(e);
    }
  });

  router.get('/link/:uid', async (req, res, next) => {
    try {
      res.send((await webService.getItem(req.params.uid, 'link')).serialize());
    } catch (e) {
      next(e);
    }
  });

  router.get('/list', async (req, res, next) => {
    try {
      res.send((await listRepository.getAll(
        req.query.limit || 10,
        req.query.page || 0
      )).map(l => l.serialize()))
    } catch (e) {
      next(e);
    }
  });

  router.get('/list/:uid/link', async (req, res, next) => {
    try {
      res.send((await linkRepository.getAll(
        req.query.limit || 10,
        req.query.page || 0
      )).map(l => l.serialize()));
    } catch (e) {
      next(e);
    }
  });

  router.get('/dashboard', async (req, res, next) => {
    res.render('dash');
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
        res.send({
          ...searchRes,
          result: searchRes.result.map(e => e.serialize().toShortVersion())
        });
      } else {
        next(new Error('Please provide a query'))
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

module.exports = Routes;
