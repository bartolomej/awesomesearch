import List from "../models/list";
import Link from "../models/link";
import {
  LinkRepositoryInt,
  ListRepositoryInt,
  SearchLogRepositoryInt
} from "../repos/repos";
import logger from "../logger";
import {
  TYPEORM_DUP_ENTRY_CODE,
  TYPEORM_NOT_FOUND_CODE
} from "../constants";
import { Job, Queue } from "bull";
import { ListServiceInt } from "../services/list";
import { GithubServiceInt } from "../services/github";
import FlexSearch from 'flexsearch';
import SearchLog from "../models/searchlog";

export interface WebServiceProps {
  listRepository: ListRepositoryInt;
  linkRepository: LinkRepositoryInt;
  githubService: GithubServiceInt;
  listService: ListServiceInt;
  searchLogRepository: SearchLogRepositoryInt;
  listQueue: Queue;
  linkQueue: Queue;
}

interface ListQueryParams {
  query: string;
  page?: number;
  limit?: number;
  useragent?: string;
}

interface LinkQueryParams extends ListQueryParams {
  listUid?: string;
}

interface IndexStats {
  id: number;
  items: number;
  cache: boolean;
  matcher: number;
  threshold: number;
  resolution: number;
  contextual: number;
}

export interface WebServiceInt {
  searchLinks (q: LinkQueryParams): Promise<[Array<Link>, number]>;

  searchLists (q: ListQueryParams): Promise<[Array<List>, number]>;

  suggest (q: string, page?: number, limit?: number): Promise<SuggestResult>;

  buildSuggestionIndex (batchSize: number): Promise<void>;

  getSuggestionIndexStats (): IndexStats;

  queueList (url: string): Promise<Job>;

  queueLink (url: string, source: string): Promise<Job>;

  queueFromRoot (): Promise<Array<Job>>;
}

export interface SuggestResult {
  page: number;
  next: number | null;
  results: Array<any>;
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
    const list = List.createFromJson(result);
    try {
      await listRepository.save(list);
    } catch (e) {
      if (new RegExp(TYPEORM_NOT_FOUND_CODE).test(e.message)) {
        log.info(e.message)
      }
      if (new RegExp(TYPEORM_DUP_ENTRY_CODE).test(e.message)) {
        log.info(`Duplicate list entity: ${list.uid}`)
      } else {
        log.error(e)
      }
    }
    // post link jobs for found urls
    await Promise.all(
      list.urls.map(url => queueLink(url, list.uid))
    )
  });

  linkQueue.on('global:completed', async (jobId, result) => {
    log.debug(`Received completed link job: ${jobId}`);
    const link = Link.createFromJson(result);
    try {
      await linkRepository.save(link);
    } catch (e) {
      if (e.message === TYPEORM_NOT_FOUND_CODE) {
        log.info(e.message)
      }
      if (e.message === TYPEORM_DUP_ENTRY_CODE) {
        log.info(`Duplicate link entity: ${link.uid}`)
      } else {
        log.error(e)
      }
    }
  });

  async function searchLinks ({
    query, listUid, page = 0, limit = 15, useragent
  }): Promise<[Array<Link>, number]> {
    const [links, total] = await Promise.all([
      linkRepository.search({ query, listUid, limit, page }),
      linkRepository.countSearchResults(query),
      // log search to db
      searchLogRepository.save(new SearchLog(query, useragent))
    ])
    return [links, total];
  }

  async function searchLists ({
    query, page = 0, limit = 15, useragent
  }): Promise<[Array<List>, number]> {
    const [lists, total] = await Promise.all([
      listRepository.search({ query, limit, page }),
      listRepository.countSearchResults(query),
      // log search to db
      searchLogRepository.save(new SearchLog(query, useragent))
    ]);
    return [lists, total];
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
      results: searchRes.result
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

  function getSuggestionIndexStats () {
    return keywordIndex.info();
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
    searchLinks,
    searchLists,
    suggest,
    queueFromRoot,
    queueLink,
    buildSuggestionIndex,
    getSuggestionIndexStats,
    queueList,
  }
}
