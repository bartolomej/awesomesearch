const router = require('express').Router();
const awesomeService = require('./services/awesome');
const awesomeRepo = require('./repositories/awesome');
const websiteRepo = require('./repositories/website');

router.get('/search', async (req, res, next) => {
  // TODO: testing purposes only
  await awesomeService.scrapeAwesomeRoot();
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
