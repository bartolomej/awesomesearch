const router = require('express').Router();
const service = require('./service');
const websiteService = require('../services/website');
const repo = require('./repository');

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
        path: '/object?uid={object_uid}',
        examplePath: '/object?url=',
        description: 'Returns information about object.'
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

router.get('/object', async (req, res, next) => {
  try {
    if (req.query.uid) {
      res.send(service.getItem(req.query.uid).serialize());
    } else {
      next(new Error('Please provide object url as query param'));
    }
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
      const html = await websiteService.getHtml(req.query.url);
      const metadata = await websiteService.getMetadata(html, req.query.url);
      if (req.headers.accept.indexOf('text/html') === 0) {
        res.render('metadata', metadata);
      } else {
        res.send(metadata);
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
    res.send(
      (await service.randomItems(req.query.n || 6))
        .map(e => e.serialize())
    );
  } catch (e) {
    next(e);
  }
});

router.get('/search', async (req, res, next) => {
  try {
    if (req.query.q) {
      const searchRes = await service.search(
        req.query.q,
        req.query.p || true,
        req.query.limit ? parseInt(req.query.limit) : 15
      );
      res.send({
        ...searchRes,
        result: searchRes.result.map(e => e.serialize())
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
    res.send({
      link_count: repo.getWebsiteCount(),
      repo_count: repo.getAwesomeCount(),
      search_stats: service.searchStats(),
      repos: (await repo.getAllAwesome())
        .map(e => e.serialize().toShortVersion())
    })
  } catch (e) {
    next(e);
  }
});

/**
 * Dispatch awesome job.
 */
router.post('/awesome', async (req, res, next) => {
  try {
    if (req.query.url) {
      res.send(await service.fetchAwesomeRepo(req.query.url));
    } else {
      res.send(await service.fetchAwesomeFromRoot());
    }
  } catch (e) {
    next(e);
  }
});

/**
 * Dispatch website job.
 */
router.post('/website', async (req, res, next) => {
  try {
    if (req.query.url) {
      res.send(await service.scrapeWebsite(req.query.url));
    } else {
      next(new Error('Please provide website url'));
    }
  } catch (e) {
    next(e);
  }
});

module.exports = router;
