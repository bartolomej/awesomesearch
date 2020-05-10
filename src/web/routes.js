const router = require('express').Router();
const service = require('./service');
const websiteService = require('../services/website');
const repo = require('./repository');


router.get('/website', async (req, res, next) => {
  try {
    res.send(await repo.getAllWebsites());
  } catch (e) {
    next(e);
  }
});

router.get('/awesome', async (req, res, next) => {
  try {
    if (req.query.url) {
      res.send(await repo.getAwesome(req.query.uid));
    } else {
      res.send(await repo.getAllAwesome(req.query.limit));
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
      res.render('metadata', {...metadata, layout: false});
    } else {
      next(new Error('Please provide website url'));
    }
  } catch (e) {
    next(e);
  }
});

router.get('/random', async (req, res, next) => {
  try {
    res.send(serializeRandomResults(
      await service.randomItems(req.query.n || 6))
    );
  } catch (e) {
    next(e);
  }
});

router.get('/search', async (req, res, next) => {
  try {
    if (req.query.q) {
      res.send(serializeSearchResults(await service.search(
        req.query.q,
        req.query.p || true,
        req.query.limit ? parseInt(req.query.limit) : 15
      )));
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
      search_stats: service.searchStats()
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

function serializeSearchResults (res) {
  return { ...res, result: res.result.map(serializeItem) };
}

function serializeRandomResults (res) {
  return res.map(serializeItem);
}

function serializeItem (item) {
  return item.object_type === 'link' ? ({
    ...item,
    tags: item.keywords,
    keywords: undefined,
  }) : ({
    uid: item.uid,
    ...item
  });
}

module.exports = router;
