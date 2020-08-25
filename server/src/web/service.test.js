const { describe, expect, it } = require("@jest/globals");
const WebService = require('../web/service');
const Repository = require('../models/repository');
const Website = require('../models/website');
const List = require('../models/list');
const Link = require('../models/link');

/**
 * Each test case initializes web service with mocked dependencies.
 */
describe('Web service tests', function () {

  it('should handle list result given completed job', async function () {
    const { workQueue, listRepository, service } = webServiceFactory();

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
    expect(searchResult.result).toEqual([list]);
  });

  it('should handle link result given completed job', async function () {
    const { workQueue, linkRepository, service } = webServiceFactory();

    const link = new Link(
      'https://link.com',
      'amnashanwar.awesome-portfolios',
      new Website('https://link.com', 'LinkTest')
    );
    workQueue._setJob('1', { name: 'link' });
    await workQueue._completeJob('1', JSON.stringify(link));
    const searchResult = await service.search('LinkTest');

    expect(linkRepository.get(link.uid)).toEqual(link);
    expect(searchResult.result).toEqual([link]);
  });

});

function webServiceFactory () {
  const workQueue = MockQueue();
  const listRepository = MockRepository();
  const linkRepository = MockRepository();
  const service = WebService({ listRepository, linkRepository, workQueue });
  return { workQueue, listRepository, linkRepository, service }
}

function MockQueue () {
  let completedCb;
  let jobs = {};
  let queuedJobs = [];

  function on (name, cb) {
    if (name === 'global:completed') {
      completedCb = cb;
    }
  }

  async function add (name, data) {
    queuedJobs.push({ name, data });
  }

  async function getJob (id) {
    return jobs[id];
  }

  function _getQueuedJobs () {
    return queuedJobs;
  }

  function _setJob (id, job) {
    jobs[id] = job;
  }

  async function _completeJob (id, result) {
    // mock completed job
    await completedCb(id, result);
  }

  return { on, _completeJob, _setJob, getJob, add, _getQueuedJobs }
}

function MockRepository () {

  let store = {};

  async function search (query) {
    let results = [];
    for (let key in store) {
      let matches = false;
      for (let k in store[key]) {
        if (new RegExp(query).test(store[key][k])) {
          matches = true;
        }
      }
      if (matches) {
        results.push(store[key])
      }
    }
    return results;
  }

  function save (object) {
    store[object.uid] = object;
    return store[object.uid];
  }

  function getCount () {
    return Object.keys(store).length;
  }

  function get (uid) {
    const object = store[uid];
    if (object) {
      return object;
    } else {
      throw new Error('Entity not found');
    }
  }

  function getRandomObject (n = 1) {
    const results = [];
    for (let i = 0; i < n; i++) {
      const keys = Object.keys(store);
      const rand = Math.round(Math.random() * keys.length - 1);
      results.push(store[keys[rand]]);
    }
    return results;
  }

  function getAll (limit = null) {
    const keys = Object.keys(store);
    return keys.map(k => store[k])
      .slice(0, limit || keys.length);
  }

  function removeAll () {
    store = {};
  }

  function remove (uid) {
    store[uid] = undefined;
  }

  function exists (uid) {
    return store[uid] !== undefined;
  }

  return {
    save,
    get,
    search,
    remove,
    removeAll,
    getAll,
    exists,
    getCount,
    getRandomObject
  }

}
