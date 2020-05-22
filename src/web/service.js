const github = require('../services/github');
const listService = require('../services/list');
const Link = require('../models/link');
const List = require('../models/list');
const IndexObject = require('../models/index-object');
const FlexSearch = require("flexsearch");
const logger = require('../logger')('web-service');

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

  // https://github.com/nextapps-de/flexsearch
  const index = new FlexSearch({
    encode: "advanced",
    tokenize: "reverse",
    doc: {
      id: 'uid',
      field: IndexObject.fields
    }
  });

  /**
   * Triggered when jobs are completed with resulting value.
   */
  workQueue.on('global:completed', async (jobId, result) => {
    const job = await workQueue.getJob(jobId);

    if (job.name === 'list') {
      const list = List.createFromJson(result)
      try {
        await listRepository.save(list);
        await addToIndex(list);
      } catch (e) {
        if (/ER_DUP_ENTRY/.test(e.message)) {
          logger.info(`Duplicate entry for list: ${list.uid}`)
        } else {
          throw e;
        }
      }
      // post link jobs for found urls
      for (let url of list.urls) {
        await scrapeLink(url, list.uid);
      }
    } else if (job.name === 'link') {
      const link = Link.createFromJson(result);
      try {
        await linkRepository.save(link);
        await addToIndex(link);
      } catch (e) {
        if (/ER_DUP_ENTRY/.test(e.message)) {
          logger.info(`Duplicate entry for link: ${link.uid}`)
        } else {
          throw e;
        }
      }
    }
  });

  function randomObject (n = 6) {
    let results = [];
    for (let i = 0; i < n; i++) {
      const rand = linkRepository.randomObject();
      if (rand) {
        results.push(rand);
      }
    }
    return results;
  }

  // TODO: implement field search
  async function search ({ query, page = true, limit = 15 }) {
    const searchRes = await index.search({ limit, page, query, suggest: true });
    const result = searchRes.result ?
      await Promise.all(searchRes.result.map(getItem)) : [];
    return {
      page: parseInt(searchRes.page),
      next: searchRes.next ? parseInt(searchRes.next) : null,
      result
    };
  }

  async function buildIndex (itemsPerBatch = 50) {
    let linkBatchSize = 0;
    let linkPageIndex = 0;
    while (linkBatchSize > 0 || linkPageIndex === 0) {
      const batch = await linkRepository.getAll(itemsPerBatch, linkPageIndex);
      await Promise.all(batch.map(addToIndex));
      linkBatchSize = batch.length;
      linkPageIndex++;
    }
    let listBatchSize = 0;
    let listPageIndex = 0;
    while (listBatchSize > 0 || listPageIndex === 0) {
      const batch = await listRepository.getAll(itemsPerBatch, listBatchSize);
      await Promise.all(batch.map(addToIndex));
      listBatchSize = batch.length
      listPageIndex++;
    }
  }

  async function addToIndex (object) {
    // add serialized string data to search index
    if (object instanceof Link && await linkRepository.exists(object.uid)) {
      index.add(object.serializeToIndex());
    }
    if (object instanceof List && await listRepository.exists(object.uid)) {
      index.add(object.serializeToIndex());
    }
  }

  async function getItem (obj) {
    if (obj.type === 'link') {
      return await linkRepository.get(obj.uid)
    }
    if (obj.type === 'list') {
      return await listRepository.get(obj.uid)
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
      searchIndex: index.info()
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
    randomObject,
    search,
    scrapeFromRoot,
    scrapeLink,
    buildIndex,
    scrapeList,
    getStats,
    workQueue,
  }
}

module.exports = WebService;
