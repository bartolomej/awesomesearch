const router = require('express').Router();
const awesomeService = require('./services/awesome');
const awesomeRepo = require('./repositories/awesome');
const userRepo = require('./repositories/user');
const websiteRepo = require('./repositories/website');

router.get('/search', async (req, res, next) => {
  // TODO: testing purposes only
  await awesomeService.scrapeAwesomeRoot();
  if (req.query.q) {
    const awesome = await awesomeRepo.getMatched(req.query.q);
    const website = await websiteRepo.getMatched(req.query.q);
    res.send([...awesome, ...website ]);
  } else {
    res.send('Welcome to awesome search API');
  }
});

router.get('/awesome', async (req, res, next) => {
  // TODO: testing purposes only
  await awesomeService.scrapeAwesomeRoot();
  if (req.query.search) {
    res.send(await awesomeRepo.getMatched(req.query.search));
  } else {
    res.send(await awesomeRepo.getAll());
  }
});

router.get('/website', async (req, res, next) => {
  if (req.query.search) {
    res.send(await websiteRepo.getMatched(req.query.search));
  } else {
    res.send(await websiteRepo.getAll());
  }
});

router.get('/user', async (req, res, next) => {
  res.send(await userRepo.getAllUsers());
});

router.get('/user/:uid', async (req, res, next) => {
  try {
    res.send(await userRepo.getUser(req.params.uid));
  } catch (e) {
    next(e);
  }
});



module.exports = router;
