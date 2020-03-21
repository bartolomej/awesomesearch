const router = require('express').Router();
const awesomeService = require('./services/awesome');
const websiteService = require('./services/website');
const userService = require('./services/user');
const awesomeRepo = require('./repositories/awesome');
const userRepo = require('./repositories/user');
const websiteRepo = require('./repositories/website');

router.get('/awesome', async (req, res, next) => {
  await awesomeService.scrapeAwesomeRoot();
  res.send(await awesomeRepo.getAll());
});

router.get('/website', async (req, res, next) => {
  if (req.query.search) {
    res.send(await websiteRepo.getMatchedWebsites(req.query.search));
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
