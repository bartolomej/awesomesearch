const router = require('express').Router();
const awesomeService = require('./services/awesome');
const websiteService = require('./services/website');
const awesomeRepo = require('./repositories/awesome');
const websiteRepo = require('./repositories/website');

router.get('/website', async (req, res, next) => {
  try {
    if (req.query.url) {
      res.send(await websiteService.scrapeUrl(req.query.url));
    } else {
      res.send(await websiteRepo.getAll());
    }
  } catch (e) {
    next(e);
  }
});

router.get('/awesome', async (req, res, next) => {
  try {
    res.send(await awesomeRepo.getAll());
  } catch (e) {
    next(e);
  }
});

router.post('/awesome', async (req, res, next) => {
  try {
    if (!req.query.url) {
      return res.send('Provide url in query params');
    }
    awesomeService.updateAwesome(req.query.url)
      .then(() => console.log('Awesome updated!'))
      .catch(() => console.log('Awesome update failed!'));
    res.send('Started awesome job ...');
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
    res.send('Welcome to awesome search API');
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
