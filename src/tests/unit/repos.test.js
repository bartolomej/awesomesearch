const { describe, expect, it, beforeAll, afterAll, afterEach } = require("@jest/globals");
const path = require('path');
const linkRepository = require('../../web/repos/link');
const listRepository = require('../../web/repos/list');
const searchLogRepository = require('../../web/repos/searchlog');
const Link = require('../../models/link');
const List = require('../../models/list');
const Website = require('../../models/website');
const SearchLog = require('../../models/searchlog');
const Repository = require('../../models/repository');
const typeorm = require('../../web/typeorm');

describe('Link repository tests', function () {

  beforeAll(async () => {
    require('dotenv').config({ path: path.join(__dirname, '..', '..', '..', '.env.development') })
    await typeorm.create();
  });

  afterAll(async () => {
    await typeorm.close();
  });

  afterEach(async () => {
    await listRepository.removeAll();
  });

  it('should save and fetch list model', async function () {
    const list = exampleList('https://github.com/bartolomej/bookmarks');

    const savedList = await listRepository.save(list);
    const fetchedList = await listRepository.get(list.uid);

    expect(savedList).toEqual(list);
    expect(fetchedList).toEqual(list);
  });

  it('should overwrite saved link model', async function () {
    const link0 = exampleLink('https://github.com/bartolomej/bookmarks');
    const link1 = exampleLink('https://github.com/bartolomej/bookmarks');
    link1.author = 'example';
    const savedLink = await linkRepository.save(link0);
    const overwrittenLink = await linkRepository.save(link1);
    const fetchedLink = await linkRepository.get(link1.uid);

    expect(savedLink).toEqual(link0);
    expect(overwrittenLink).toEqual(link1);
    expect(fetchedLink).toEqual(link1);
  });

  it('should fetch list that doesnt exist', async function () {
    try {
      await listRepository.get('invalidUid');
      expect(1).toBe(2);
    } catch (e) {
      expect(e.message).toEqual('Object not found')
    }
  });

  it('should save and fetch link', async function () {
    const link = exampleLink();

    const savedLink = await linkRepository.save(link);
    const fetchedLink = await linkRepository.get(link.uid);
    const allFromSource = await linkRepository.getFromSource('user.example');

    expect(savedLink).toEqual(link);
    expect(fetchedLink).toEqual(link);
    expect(allFromSource).toEqual([link]);
  });

  it('should count link records', async function () {
    expect(await linkRepository.getCount()).toBe(0);
    await linkRepository.save(new Link('https://example.com', 'example'));
    expect(await linkRepository.getCount()).toBe(1);
  });

  it('should fetch links all with pagination', async function () {
    jest.setTimeout(10000);
    // insert 10 links in database
    for (let i = 0; i < 10; i++) {
      await linkRepository.save(exampleLink(i));
    }

    const firstPage = await linkRepository.getAll(3, 0);
    const secondPage = await linkRepository.getAll(3, 1);

    expect(firstPage.length).toBe(3);
    expect(/example2/.test(firstPage[2].uid)).toBeTruthy();
    expect(secondPage.length).toBe(3);
    expect(/example5/.test(secondPage[2].uid)).toBeTruthy();
  });

  it('should fetch link with half empty and null page', async function () {
    await linkRepository.save(exampleLink());

    const firstPage = await linkRepository.getAll(2, 0);
    const secondPage = await linkRepository.getAll(2, 1);

    expect(firstPage.length).toBe(1);
    // expect empty page if no items to return
    expect(secondPage.length).toBe(0);
  });

  it('should fetch 2 random link objects', async function () {
    await linkRepository.save(exampleLink());
    const random = await linkRepository.getRandomObject(1);

    expect(random.length).toBe(1);
    expect(random.repository).not.toBeNull();
    expect(random.website).not.toBeNull();
  });

  it('should fetch links that belong to list', async function () {
    const sourceList = exampleList('.test');
    const link1 = exampleLink(1);
    link1.source = sourceList.uid;
    const link2 = exampleLink(2);
    link2.source = sourceList.uid;

    await listRepository.save(sourceList);
    await linkRepository.save(link1);
    await linkRepository.save(link2);
    // unrelated link
    await linkRepository.save(exampleLink(3));

    const links = await linkRepository.getAll(10, 0, sourceList.uid);
    const count = await linkRepository.getCount(sourceList.uid);

    expect(links.length).toBe(2);
    expect(count).toBe(2);
    expect(links[0]).toEqual(link1);
    expect(links[1]).toEqual(link2);
  });

});

describe('SearchLog repository', function () {

  beforeAll(async () => {
    require('dotenv').config({ path: path.join(__dirname, '..', '..', '..', '.env.development') })
    await typeorm.create();
  });

  afterAll(async () => {
    await typeorm.close();
  });

  beforeEach(async () => {
    await searchLogRepository.removeAll();
  });

  it('should save log', async function () {
    const log = new SearchLog('test', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36');
    const saved = await searchLogRepository.save(log);
    const all = await searchLogRepository.getSortedByDate();

    expect(all.length).toBe(1);
    expect(all[0]).toEqual(log);
    expect(saved).toEqual(log);
  });

  it('should count all searches', async function () {
    const logs = [
      new SearchLog('test', 'Mozilla/5.0 (Macintosh; ...'),
      new SearchLog('test2', 'Mozilla/5.0 (Macintosh; ...'),
    ];
    for (let l of logs) {
      await searchLogRepository.save(l);
    }

    const count = await searchLogRepository.getCount();
    expect(count).toBe(2)
  });

  it('should group by query, order by popularity', async function () {
    const logs = [
      new SearchLog('test', 'Mozilla/5.0 (Macintosh; ...'),
      new SearchLog('test', 'Mozilla/5.0 (Macintosh; ...'),
      new SearchLog('test1', 'Mozilla/5.0 (Macintosh; ...'),
      new SearchLog('test1', 'Mozilla/5.0 (Macintosh; ...'),
      new SearchLog('test1', 'Mozilla/5.0 (Macintosh; ...'),
    ];
    for (let l of logs) {
      await searchLogRepository.save(l);
    }

    const stats = await searchLogRepository.getCountByQuery();
    expect(stats).toEqual([
      { query: 'test1', count: 3 },
      { query: 'test', count: 2 },
    ])
  });

  it('should count all searches by date', async function () {
    const logs = await insertLogFor3days();

    const count = await searchLogRepository.getCountByDate();
    expect(count).toEqual([
      { datetime: logs[0].datetime, count: 1 },
      { datetime: logs[1].datetime, count: 1 },
      { datetime: logs[2].datetime, count: 1 },
    ])
  });

  it('should count all searches from date', async function () {
    const logs = await insertLogFor3days();

    const fromDate = new Date(new Date().setHours(new Date().getHours() - 24));
    const count = await searchLogRepository.getCountByDate(fromDate);

    expect(count).toEqual([
      { datetime: logs[0].datetime, count: 1 },
    ])
  });

  it('should count all searches to date', async function () {
    const logs = await insertLogFor3days();

    const toDate = new Date(new Date().setHours(new Date().getHours() - 24));
    const count = await searchLogRepository.getCountByDate(null, toDate);

    expect(count).toEqual([
      { datetime: logs[1].datetime, count: 1 },
      { datetime: logs[2].datetime, count: 1 },
    ])
  });

  it('should count all searches from and to date', async function () {
    const logs = await insertLogFor3days();

    const fromDate = new Date(new Date().setHours(new Date().getHours() - 48));
    const toDate = new Date(new Date().setHours(new Date().getHours() - 24));
    const count = await searchLogRepository.getCountByDate(fromDate, toDate);

    expect(count).toEqual([
      { datetime: logs[1].datetime, count: 1 },
    ])
  });

});

async function insertLogFor3days () {
  const logs = [
    new SearchLog('test', '', new Date()),
    new SearchLog('test2', '', new Date(new Date().setHours(new Date().getHours() - 24))),
    new SearchLog('test2', '', new Date(new Date().setHours(new Date().getHours() - 48))),
  ];
  for (let l of logs) {
    await searchLogRepository.save(l);
  }
  return logs;
}

function exampleLink (urlPostfix = '') {
  const website = new Website(`https://example.com${urlPostfix}`, 'example');
  const repository = new Repository(`https://github.com/user/example${urlPostfix}`);
  repository.stars = 12;
  repository.forks = 23;
  repository.topics = ['test'];
  return new Link(`https://github.com/user/example${urlPostfix}`, 'user.example', website, repository);
}

function exampleList (urlPostfix = '') {
  const listGithubRepo = new Repository(`https://github.com/bartolomej/bookmarks${urlPostfix}`);
  listGithubRepo.stars = 12;
  listGithubRepo.forks = 23;
  listGithubRepo.topics = ['test'];
  return new List(`https://github.com/user/example${urlPostfix}`, listGithubRepo);
}
