const { describe, expect, it } = require("@jest/globals");
const WebService = require('../../web/service');
const MockQueue = require('../mocks/queue');
const memoryDb = require('../../web/repos/memorydb');
const Repository = require('../../models/repository');
const Website = require('../../models/website');
const List = require('../../models/list');
const Link = require('../../models/link');


/**
 * Each test case initializes web service with mocked dependencies.
 */
describe('Web service tests', function () {

  it('should handle list result given completed job', async function () {
    const workQueue = MockQueue();
    const listRepository = memoryDb();
    const linkRepository = memoryDb();
    const service = WebService({ listRepository, linkRepository, workQueue });

    const listUrl = 'https://github.com/amnashanwar/awesome-portfolios';
    const linkUrl = 'https://link.com';
    const list = new List(listUrl, new Repository(listUrl), [linkUrl]);
    workQueue._setJob('1', { name: 'list' });
    await workQueue._completeJob('1', JSON.stringify(list));
    const searchResult = await service.search({ query: 'portfolios' });

    expect(listRepository.get(list.repository.uid)).toEqual(list);
    expect(workQueue._getQueuedJobs()).toEqual([{
      name: 'link',
      data: { url: linkUrl, source: list.repository.uid }
    }]);
    expect(searchResult.result.length).toBe(1);
  });

  it('should handle link result given completed job', async function () {
    const workQueue = MockQueue();
    const listRepository = memoryDb();
    const linkRepository = memoryDb();
    const service = WebService({ listRepository, linkRepository, workQueue });

    const link = new Link(
      'https://link.com',
      'amnashanwar.awesome-portfolios',
      new Website('https://link.com', 'LinkTest')
    );
    workQueue._setJob('1', { name: 'link' });
    await workQueue._completeJob('1', JSON.stringify(link));
    const searchResult = await service.search({ query: 'LinkTest' });

    expect(linkRepository.get(link.uid)).toEqual(link);
    expect(searchResult.result.length).toBe(1);
  });

});
