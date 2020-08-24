const github = require('../services/github');
const listService = require('../services/list');
const Link = require('../models/link');
const List = require('../models/list');
const FlexSearch = require("flexsearch");
const logger = require('../logger')('web-service');
const searchLogRepository = require('./repos/searchlog');
const AwesomeError = require('../error');

function WebService ({ listRepository, linkRepository, workQueue }) {

  if (!workQueue) {
    throw new Error('Queue dependency not provided');
  }
  if (!linkRepository) {
    throw new Error('Link repository not provided');
  }
  if (!listRepository) {
    throw new Error('List repository not provided');
  }

  // TODO: test keyword search with MySQL index
  /**
   * Keywords / topics index.
   * Used for search suggestions.
   */
  const keywordIndex = new FlexSearch({
    encode: "advanced",
    tokenize: "reverse",
    suggest: true,
    cache: true
  });

  /**
   * Handle redis queue error events.
   */
  workQueue.on('error', error => {
    if (error.code === 'ECONNREFUSED') {
      logger.error(`Redis connection not available: ${error}`)
    } else {
      logger.error(error);
    }
  });

  /**
   * Triggered when jobs are completed with resulting value.
   */
  workQueue.on('global:completed', async (jobId, result) => {
    const job = await workQueue.getJob(jobId);

    if (job.name === 'list') {
      await onListJobCompleted(List.createFromJson(result));
    } else if (job.name === 'link') {
      await onLinkJobCompleted(Link.createFromJson(result));
    }
  });

  async function onListJobCompleted (list) {
    try {
      await listRepository.save(list);
    } catch (e) {
      if (e.message === AwesomeError.types.DUPLICATE_ENTRY) {
        logger.info(e.message);
      } else {
        logger.error(e);
      }
    }
    // post link jobs for found urls
    for (let url of list.urls) {
      await scrapeLink(url, list.uid);
    }
  }

  async function onLinkJobCompleted (link) {
    try {
      await linkRepository.save(link);
    } catch (e) {
      if (e.message === AwesomeError.types.DUPLICATE_ENTRY) {
        logger.info(e.message)
      } else {
        logger.error(e)
      }
    }
  }

  async function buildKeywordIndex (batchSize = 100) {
    let keywords = await linkRepository.getAllKeywords(0, batchSize);
    let topics = await listRepository.getAllTopics(0, batchSize);

    // build index by batches
    let kIndex = 0;
    while (keywords.length > 0) {
      keywords = await linkRepository.getAllKeywords(batchSize, kIndex);
      keywords.forEach(k => keywordIndex.add(k, k))
      kIndex++;
    }
    let tIndex = 0;
    while (topics.length > 0) {
      topics = await listRepository.getAllTopics(batchSize, tIndex);
      topics.forEach(k => keywordIndex.add(k, k))
      tIndex++;
    }
  }

  function suggest ({ query, page = true, limit = 15 }) {
    const searchRes = keywordIndex.search({ limit, page, query, suggest: true });
    return {
      page: parseInt(searchRes.page),
      next: searchRes.next ? parseInt(searchRes.next) : null,
      result: searchRes.result
    };
  }

  // TODO: implement field search
  async function search ({ query, page = 0, limit = 15 }) {
    const result = (await Promise.all([
      linkRepository.search(query, limit, page),
      listRepository.search(query, limit, page),
    ])).flat();
    return {
      page,
      next: result.length > 0 ? page + 1 : null,
      result
    };
  }

  async function getList (uid) {
    try {
      return await listRepository.get(uid)
    } catch (e) {
      logger.error(`Error fetching list ${uid} from db: ${e}`);
      throw e;
    }
  }

  async function getLink (uid) {
    try {
      const link = await linkRepository.get(uid);
      if (link.source) {
        try {
          link.source = await listRepository.get(link.source);
        } catch (e) {
          logger.error(`Error fetching source list ${link.source} for ${uid}: ${e}`);
        }
      }
      return link;
    } catch (e) {
      logger.error(`Error fetching link ${uid} from db: ${e}`);
      throw e;
    }
  }

  async function scrapeLink (url, source = null) {
    return await workQueue.add('link', { url, source });
  }

  async function scrapeList (url) {
    return await workQueue.add('list', { url });
  }

  async function getStats () {
    return {
      linkCount: await linkRepository.getCount(),
      listCount: await listRepository.getCount(),
      searchCount: await searchLogRepository.getCount(),
      keywordsIndex: keywordIndex.info()
    }
  }

  async function scrapeFromRoot () {
    const AWESOME_README_ROOT_ID = 'sindresorhus/awesome';
    const readme = await github.getReadme(AWESOME_README_ROOT_ID);
    const urls = await listService.parseReadme(readme, true);
    const jobs = [];
    for (let url of urls) {
      jobs.push(await workQueue.add('awesome', { url }));
    }
    return jobs;
  }

  return {
    search,
    suggest,
    scrapeFromRoot,
    scrapeLink,
    buildKeywordIndex,
    getLink,
    getList,
    scrapeList,
    getStats,
    workQueue,
  }
}

module.exports = WebService;
