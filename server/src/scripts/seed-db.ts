import faker from 'faker';
import * as typeorm from '../web/typeorm';
import logger from "../logger";
import LinkRepository from "../web/repos/link";
import ListRepository from "../web/repos/list";
import List from "../models/list";
import Link from "../models/link";
import Repository from "../models/repository";
import Website from "../models/website";
import { webEnv } from "../env";


const {
  N_LISTS,
  N_LINKS_PER_LIST
} = process.env;

async function main () {
  const log = logger('script:seed-db');
  const listRepository = ListRepository();
  const linkRepository = LinkRepository();


  try {
    const env = webEnv();
    await typeorm.create({
      database: env.DB_NAME,
      username: env.DB_USERNAME,
      password: env.DB_PASSWORD,
      host: env.DB_HOST
    });
    log.debug(`Connected to database`)
  } catch (e) {
    log.error(`Error while connecting to db: ${e}`);
    process.exit(1);
  }
  for (let i = 0; i < parseInt(N_LISTS); i++) {
    // @ts-ignore
    const list = new List();
    list.uid = faker.random.uuid();
    list.url = faker.internet.url();
    // @ts-ignore
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
    log.debug(`Saved ${list.uid} list`);
    let links = [];
    for (let j = 0; j < parseInt(N_LINKS_PER_LIST); j++) {
      // @ts-ignore
      const link = new Link();
      // @ts-ignore
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
    log.debug(`Saved ${links.length} links from ${list.uid}`)
  }
  log.info('Done seeding !');
  process.exit(0);
}

function randInt (max) {
  return Math.round(Math.random() * max)
}

main();
