import List from "../models/list";
import Link from "../models/link";
import {
  LinkRepositoryInt,
  ListRepositoryInt,
  SearchLogRepositoryInt
} from "./repos/repos";
import logger from "../logger";
import { ERROR_MSG_NOT_FOUND } from "../constants";
import { Job, Queue } from "bull";
import { ListServiceInt } from "../services/list";
import { GithubServiceInt } from "../services/github";
import FlexSearch from 'flexsearch';

interface WebServiceProps {
  listRepository: ListRepositoryInt;
  linkRepository: LinkRepositoryInt;
  githubService: GithubServiceInt;
  listService: ListServiceInt;
  searchLogRepository: SearchLogRepositoryInt;
  listQueue: Queue;
  linkQueue: Queue;
}

export interface WebServiceInt {
  search (q: string, page?: number, limit?: number): Promise<SearchResult>;

  suggest (q: string, page?: number, limit?: number): Promise<SuggestResult>;

  buildSuggestionIndex (batchSize: number): Promise<void>;

  getList (uid: string): Promise<List>;

  getLink (uid: string): Promise<Link>;

  queueList (url: string): Promise<Job>;

  queueLink (url: string, source: string): Promise<Job>;

  getStats (): Promise<StatsResult>;

  queueFromRoot (): Promise<Array<Job>>;
}

interface SearchResult {
  page: number;
  next: number | null;
  result: Array<List | Link>;
}

interface SuggestResult {
  page: number;
  next: number | null;
  result: Array<any>;
}

interface StatsResult {
  linkCount: number;
  listCount: number;
  searchCount: number;
  keywordsIndex: Object;
}

export default function WebService ({
  listRepository,
  linkRepository,
  searchLogRepository,
  listQueue,
  linkQueue,
  githubService,
  listService
}: WebServiceProps): WebServiceInt {
  const log = logger('web-service');

  // TODO: test keyword search with MySQL index
  /**
   * Keywords / topics index.
   * Used for search suggestions.
   */
  const keywordIndex = FlexSearch.create({
    encode: "advanced",
    tokenize: "reverse",
    cache: true
  });

  listQueue.on('global:completed', async (jobId, result) => {
    log.debug(`Received completed list job: ${jobId}`);
    await _onListCompleted(List.createFromJson(result));
  });

  linkQueue.on('global:completed', async (jobId, result) => {
    log.debug(`Received completed link job: ${jobId}`);
    await _onLinkCompleted(Link.createFromJson(result));
  });

  async function _onListCompleted (list: List) {
    try {
      await listRepository.save(list);
    } catch (e) {
      if (e.message === ERROR_MSG_NOT_FOUND) {
        log.info(e.message);
      } else {
        log.error(e);
      }
    }
    // post link jobs for found urls
    await Promise.all(
      list.urls.map(url => queueLink(url, list.uid))
    )
  }


  async function _onLinkCompleted (link) {
    try {
      await linkRepository.save(link);
    } catch (e) {
      if (e.message === ERROR_MSG_NOT_FOUND) {
        log.info(e.message)
      } else {
        log.error(e)
      }
    }
  }

  // TODO: implement field search
  async function search (query, page = 0, limit = 15) {
    let result;
    try {
      const [links, lists] = await Promise.all([
        linkRepository.search(query, limit, page),
        listRepository.search(query, limit, page),
      ]);
      const sources = await Promise.all(
        // @ts-ignore
        links.map(l => listRepository.get(l.source))
      );
      for (let i = 0; i < links.length; i++) {
        links[i].source = sources[i];
      }
      result = [...links, ...lists];
    } catch (e) {
      result = [];
      log.error(`Search query failed: ${e}`)
    }
    return {
      page,
      next: result.length > 0 ? page + 1 : null,
      result
    };
  }

  async function suggest (query, page = 0, limit = 15): Promise<SuggestResult> {
    const searchRes = await keywordIndex.search({
      limit,
      // @ts-ignore
      page,
      query,
      suggest: true
    });
    return {
      page: parseInt(searchRes.page),
      next: searchRes.next ? parseInt(searchRes.next) : null,
      result: searchRes.result
    };
  }

  async function buildSuggestionIndex (batchSize = 100) {
    let keywords = await linkRepository.getAllKeywords(0, batchSize);
    let topics = await listRepository.getAllTopics(0, batchSize);

    // build index by batches
    let kIndex = 0;
    while (keywords.length > 0) {
      keywords = await linkRepository.getAllKeywords(batchSize, kIndex);
      // @ts-ignore
      keywords.forEach(k => keywordIndex.add(k, k))
      kIndex++;
    }
    let tIndex = 0;
    while (topics.length > 0) {
      topics = await listRepository.getAllTopics(batchSize, tIndex);
      // @ts-ignore
      topics.forEach(k => keywordIndex.add(k, k))
      tIndex++;
    }
  }

  async function getList (uid) {
    try {
      return await listRepository.get(uid)
    } catch (e) {
      log.error(`Error fetching list ${uid} from db: ${e}`);
      throw e;
    }
  }

  async function getLink (uid) {
    try {
      const link = await linkRepository.get(uid);
      if (link.source) {
        try {
          // @ts-ignore
          link.source = await listRepository.get(link.source);
        } catch (e) {
          log.error(`Error fetching source list ${link.source} for ${uid}: ${e}`);
        }
      }
      return link;
    } catch (e) {
      log.error(`Error fetching link ${uid} from db: ${e}`);
      throw e;
    }
  }


  async function getStats () {
    return {
      linkCount: await linkRepository.getCount(),
      listCount: await listRepository.getCount(),
      searchCount: await searchLogRepository.getTotalCount(),
      keywordsIndex: keywordIndex.info()
    }
  }

  async function queueLink (url: string, source: string = null) {
    return linkQueue.add({ url, source });
  }

  async function queueList (url: string) {
    return listQueue.add({ url });
  }

  async function queueFromRoot () {
    const readme = await githubService.getReadme('sindresorhus', 'awesome');
    const urls = await listService.parseReadme(readme, true);
    const jobs = [];
    for (let url of urls) {
      jobs.push(await listQueue.add({ url }));
    }
    return jobs;
  }

  return {
    search,
    suggest,
    queueFromRoot,
    queueLink,
    buildSuggestionIndex,
    getLink,
    getList,
    queueList,
    getStats
  }
}
