const router = require('express').Router();
const service = require('./service');
const websiteService = require('../services/website');
const awesomeRepo = require('./repositories/awesome');
const websiteRepo = require('./repositories/website');

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
      res.send('Provide website url as a query parameter !');
    }
  } catch (e) {
    next(e);
  }
});

router.get('/website', async (req, res, next) => {
  try {
    res.send(await websiteRepo.getAll());
  } catch (e) {
    next(e);
  }
});

router.get('/awesome', async (req, res, next) => {
  try {
    res.send(await awesomeRepo.getAll(req.query.limit));
  } catch (e) {
    next(e);
  }
});

router.get('/search', async (req, res, next) => {
  if (req.query.q) {
    const awesome = serializeLists(await awesomeRepo.getMatched(req.query.q));
    const website = serializeLinks(await websiteRepo.getMatched(req.query.q));
    res.send([...awesome, ...website]);
  } else {
    res.send([]);
  }
});

router.get('/job', async (req, res, next) => {
  try {
    const jobs = await service.getAllJobs();
    if (req.headers.contentType === 'application/json') {
      res.send(jobs);
    } else {
      res.render('jobs', { jobs, layout: false })
    }
  } catch (e) {
    next(e);
  }
});

router.get('/job/:id', async (req, res, next) => {
  try {
    const job = await service.getJob(req.params.id);
    if (req.headers.contentType === 'application/json') {
      res.send(job);
    } else {
      res.render('job', { ...job,
        data: JSON.stringify(job.data, null, 4),
        returnvalue: JSON.stringify(job.returnvalue, null, 4),
        layout: false })
    }
  } catch (e) {
    next(e);
  }
});

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

router.post('/website', async (req, res, next) => {
  try {
    if (!req.query.url) {
      return res.send('Provide url in query params');
    } else {
      res.send(await service.scrapeWebsite(req.query.url));
    }
  } catch (e) {
    next(e);
  }
});

function serializeLists (items) {
  return items.map(r => ({
    type: 'list',
    title: r.getRepository(),
    description: r.description,
    url: r.url,
    image: r.avatar,
    tags: r.topics,
    extras: { stars: r.stars, forks: r.forks }
  }))
}

function serializeLinks (items) {
  return items.map(l => ({
    type: 'link',
    title: l.title,
    description: l.description,
    url: l.url,
    image: l.image,
    tags: l.keywords,
    extras: {}
  }))
}

module.exports = router;
