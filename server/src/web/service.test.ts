import WebService from "./service";
import Repository from "../models/repository";
import Website from "../models/website";
import Link from "../models/link";
import List from "../models/list";
import {
  DateCountStats,
  LinkRepositoryInt,
  ListRepositoryInt,
  QueryCountStats,
  SearchLogRepositoryInt
} from "./repos/repos";
import Bull, { Job, Queue } from "bull";
import GithubService from "../services/github";
import ListService from "../services/list";
import { SearchLogQueryParams } from "./repos/searchlog";
import SearchLog from "../models/searchlog";

/**
 * Each test case initializes web service with mocked dependencies.
 */
describe('Web service tests', function () {

  it('should handle list result given completed job', async function () {
    const { listQueue, linkQueue, listRepository, service } = webServiceFactory();

    const listUrl = 'https://github.com/amnashanwar/awesome-portfolios';
    const linkUrl = 'https://link.com';
    const list = new List(listUrl, new Repository(listUrl), [linkUrl]);
    const job = { id: 1, name: 'list' };

    // mock & test queue functionality
    listQueue._setJob(job.id, job);
    expect(listQueue._getQueuedJobs()).toEqual([job]);
    await listQueue._completeJob(job.id, JSON.stringify(list));
    expect(listQueue._getCompletedJobs()).toEqual([job]);

    // validate that another link job was dispatched
    expect(linkQueue._getQueuedJobs()).toEqual([{
      id: 1,
      data: { source: list.uid, url: linkUrl }
    }]);

    // test that result is indexed
    const searchResult = await service.searchLists({ query: 'portfolios' });
    expect(searchResult).toEqual([
      [list],
      1 // total results count
    ]);

    // test that result is written to db
    expect(await listRepository.get(list.repository.uid)).toEqual(list);
  });

  it('should handle link result given completed job', async function () {
    const { linkQueue, linkRepository, listRepository, service } = webServiceFactory();

    const listUrl = 'https://github.com/amnashanwar/awesome-portfolios';
    const linkUrl = 'https://link.com';
    const source = new List(listUrl, new Repository(listUrl), [linkUrl]);
    const link = new Link(
      linkUrl, source.uid,
      new Website('https://link.com', 'LinkTest')
    );
    const job = {
      id: 1,
      data: { source: link.source, url: link.url }
    };

    linkQueue._setJob(job.id, job);
    await listRepository.save(source);
    await linkQueue._completeJob('1', JSON.stringify(link));

    const searchResult = await service.searchLinks({ query: 'link' });
    expect(searchResult).toEqual([
      [link],
      1 // total results count
    ]);
  });

});

function webServiceFactory () {
  const listQueue = MockQueue();
  const linkQueue = MockQueue();
  const listRepository = MockListRepository();
  const linkRepository = MockLinkRepository();
  const githubService = GithubService({
    accessToken: null,
    githubUsername: null
  });
  const service = WebService({
    listRepository,
    linkRepository,
    listQueue,
    linkQueue,
    listService: ListService({ githubService }),
    githubService,
    searchLogRepository: MockSearchLogRepository()
  });
  return { listQueue, linkQueue, listRepository, linkRepository, service }
}

interface MockBullQueue extends Queue {
  _setJob (id: any, job: Job | Object): void;

  _completeJob (id: any, result: any): void;

  _getQueuedJobs (): Array<Job>;

  _getCompletedJobs (): Array<Job>;

}

function MockQueue (): MockBullQueue {
  let index = 0;
  let queuedJobs = {};
  let completedJobs = {};
  let callbacks = {
    "completed": [],
    "global:completed": []
  }
  return {
    _setJob (id: string, job: Bull.Job) {
      index++;
      queuedJobs[id] = job;
    },
    async _completeJob (id: string, result: any) {
      let job = queuedJobs[id];
      completedJobs[id] = job;
      queuedJobs[id] = null;
      for (let cb of callbacks['completed']) {
        await cb(job, result);
      }
      for (let cb of callbacks['global:completed']) {
        await cb(job.id, result);
      }
    },
    _getQueuedJobs (): Array<Bull.Job> {
      return Object.keys(queuedJobs).map(k => queuedJobs[k]);
    },
    _getCompletedJobs (): Array<Bull.Job> {
      return Object.keys(completedJobs).map(k => completedJobs[k]);
    },
    // @ts-ignore
    on (event: any, callback: Bull.CompletedEventCallback<any>): any {
      if (event === 'completed') {
        callbacks['completed'].push(callback);
      }
      if (event === 'global:completed') {
        callbacks['global:completed'].push(callback);
      }
    },
    add (data: any, opts?: Bull.JobOptions): Promise<Bull.Job<any>> {
      index++;
      const job = { id: index, data };
      queuedJobs[index] = job;
      // @ts-ignore
      return Promise.resolve(job);
    },
    getJob (jobId: Bull.JobId): Promise<Bull.Job<any> | null> {
      const job = completedJobs[jobId] || queuedJobs[jobId];
      return Promise.resolve(job);
    }
  }
}

function MockSearchLogRepository (): SearchLogRepositoryInt {
  let index = 0;
  let store = {};
  return {
    getCountByDate (obj: SearchLogQueryParams): Promise<Array<DateCountStats>> {
      throw new Error('Method not implemented');
    },
    getCountByQuery (obj: SearchLogQueryParams): Promise<Array<QueryCountStats>> {
      throw new Error('Method not implemented');
    },
    getSortedByDate (obj: SearchLogQueryParams): Promise<Array<SearchLog>> {
      throw new Error('Method not implemented');
    },
    getTotalCount (): Promise<number> {
      return Promise.resolve(Object.keys(store).length);
    },
    save (log: SearchLog): Promise<SearchLog> {
      index++;
      store[index] = log;
      return Promise.resolve(log);
    }
  }
}

function MockListRepository (): ListRepositoryInt {
  let store = {};
  return {
    countSearchResults (query: string): Promise<number> {
      return Promise.resolve(searchMock(store, query).length);
    },
    exists (uid: string): Promise<boolean> {
      return Promise.resolve(store[uid] !== undefined);
    },
    get (uid: string): Promise<List> {
      const object = store[uid];
      if (object) {
        return Promise.resolve(object);
      } else {
        return Promise.reject(new Error('Entity not found'));
      }
    },
    getAll (limit: number, page: number): Promise<Array<List>> {
      const keys = Object.keys(store);
      return Promise.resolve(keys.map(k => store[k]).slice(0, limit || keys.length));
    },
    getAllTopics (page?: number, limit?: number): Promise<Array<string>> {
      const keys = Object.keys(store);
      return Promise.resolve(keys.map(k => store[k].tags).slice(0, limit || keys.length));
    },
    getCount (): Promise<number> {
      return Promise.resolve(0);
    },
    save (list: List): Promise<List> {
      store[list.uid] = list;
      return Promise.resolve(store[list.uid]);
    },
    search ({ query, limit, page }): Promise<Array<List>> {
      return Promise.resolve(searchMock(store, query));
    }
  }
}

function MockLinkRepository (): LinkRepositoryInt {
  let store = {};
  return {
    countSearchResults (query: string, listUid?: string): Promise<number> {
      return Promise.resolve(searchMock(store, query).length);
    },
    exists (uid: string): Promise<boolean> {
      return Promise.resolve(store[uid] !== undefined);
    },
    get (uid: string): Promise<Link> {
      const object = store[uid];
      if (object) {
        return object;
      } else {
        throw new Error('Entity not found');
      }
    },
    getAll (limit?: number, page?: number, source?: string): Promise<Array<Link>> {
      const keys = Object.keys(store);
      return Promise.resolve(keys.map(k => store[k]).slice(0, limit || keys.length));
    },
    getAllKeywords (limit?: number, page?: number): Promise<Array<string>> {
      const keys = Object.keys(store);
      return Promise.resolve(keys.map(k => store[k].tags).slice(0, limit || keys.length));
    },
    getCount (source?: string): Promise<number> {
      return Promise.resolve(Object.keys(store).length);
    },
    getFromSource (source: string): Promise<Array<Link>> {
      throw new Error('Mock not implemented')
    },
    getRandomObject (count?: number): Promise<Array<Link>> {
      throw new Error('Mock not implemented')
    },
    save (link: Link): Promise<Link> {
      store[link.uid] = link;
      return Promise.resolve(store[link.uid]);
    },
    search ({ query, limit, page }): Promise<Array<Link>> {
      return Promise.resolve(searchMock(store, query));
    }
  }
}

function searchMock (store: Object, query: string) {
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
