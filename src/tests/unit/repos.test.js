const { describe, expect, it, beforeAll, afterAll } = require("@jest/globals");
const path = require('path');
const linkRepository = require('../../web/repos/link');
const listRepository = require('../../web/repos/list');
const Link = require('../../models/link');
const List = require('../../models/list');
const Website = require('../../models/website');
const Repository = require('../../models/repository');
const typeorm = require('../../web/typeorm');

describe('Link repository tests', function () {

  beforeAll(async () => {
    require('dotenv').config({ path: path.join(__dirname, '..', '..', '..', '.env') })
    await typeorm.create();
  });

  afterAll(async () => {
    await typeorm.close();
  });

  beforeEach(async () => {
    await listRepository.removeAll();
  });

  it('should save and fetch list model', async function () {
    const list = exampleList('https://github.com/bartolomej/bookmarks');

    const savedList = await listRepository.save(list);
    const fetchedList = await listRepository.get(list.uid);

    expect(savedList).toEqual(list);
    expect(fetchedList).toEqual(list);
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

});

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
