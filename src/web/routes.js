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

router.get('/search', async (req, res, next) => {
  try {
    if (req.query.q) {
      res.send(await service.search(
        req.query.q,
        req.query.p || true
      ));
    } else {
      next(new Error('Please provide a query'))
    }
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
