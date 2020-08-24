const faker = require('faker');
const typeorm = require('../src/web/typeorm');
const logger = require('../src/logger')('db-seed');
const linkRepository = require('../src/web/repos/link');
const listRepository = require('../src/web/repos/list');
const List = require('../src/models/list');
const Link = require('../src/models/link');
const Repository = require('../src/models/repository');
const Website = require('../src/models/website');

const {
  N_LISTS,
  N_LINKS_PER_LIST
} = process.env;

async function main () {
  try {
    const con = await typeorm.create();
    logger.debug(`Connected to database: ${con.name}`)
  } catch (e) {
    logger.error(`Error while connecting to db: ${e}`);
    process.exit(1);
  }
  for (let i = 0; i < parseInt(N_LISTS); i++) {
    const list = new List();
    list.uid = faker.random.uuid();
    list.url = faker.internet.url();
    const repo = new Repository();
    repo.topics = new Array(randInt(10)).fill(0).map(_ => faker.lorem.word());
    repo.description = faker.lorem.sentences(3);
    repo.url = list.url;
    repo.stars = randInt(1000);
    repo.forks = randInt(1000);
    repo.homepage = faker.internet.url();
    repo.uid = faker.random.uuid();
    list.repository = repo;
    await listRepository.save(list);
    logger.debug(`Saved ${list.uid} list`);
    let links = [];
    for (let j = 0; j < parseInt(N_LINKS_PER_LIST); j++) {
      const link = new Link();
      const website = new Website();
      link.setUrl(faker.internet.url());
      link.source = list.uid;
      website.uid = faker.random.uuid();
      website.url = faker.internet.url();
      website.description = faker.lorem.sentences(4);
      website.keywords = new Array(randInt(10)).fill(0).map(_ => faker.lorem.word());
      website.title = faker.lorem.words(3);
      website.name = faker.lorem.word();
      website.type = 'website';
      website.author = `${faker.name.firstName} ${faker.name.lastName}`
      link.website = website;
      links.push(link);
    }
    await Promise.all(links.map(linkRepository.save));
    logger.debug(`Saved ${links.length} links from ${list.uid}`)
  }
  logger.info('Done seeding !');
  process.exit(0);
}

function randInt (max) {
  return Math.round(Math.random() * max)
}

main();
