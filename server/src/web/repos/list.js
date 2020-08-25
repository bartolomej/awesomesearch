const { getRepository } = require('typeorm');
const Link = require('../../models/link');
const List = require('../../models/list');
const Website = require('../../models/website');
const Repository = require('../../models/repository');
const utils = require('./utils');
const logger = require('../../logger')('list-repo');
const AwesomeError = require('../../error');

async function search (query, pageLimit = 10, pageNumber = 0) {
  return (await getRepository(List)
    .createQueryBuilder('list')
    .leftJoinAndSelect('list.repository', 'r')
    // TODO: test IN NATURAL LANGUAGE MODE WITH QUERY EXPANSION
    .where(`
      MATCH(r.url, r.homepage, r.description, r.topics)
      AGAINST ('${query}')
    `)
    .skip(pageLimit * pageNumber)
    .take(pageLimit)
    .getMany()
  ).map(utils.deserializeList);
}

async function save (list) {
  await getRepository(Repository)
    .save(utils.serializeRepo(list.repository))
    .catch(e => {
      if (/ER_DUP_ENTRY/.test(e.message)) {
        logger.info(`Repository ${list.repository.uid} exists in db.`);
      } else {
        throw e;
      }
    });
  return getRepository(List).save(list);
}

async function get (uid) {
  return utils.deserializeList(
    await getRepository(List)
      .createQueryBuilder('list')
      .leftJoinAndSelect('list.repository', 'r')
      .where('list.uid = :uid', { uid })
      .getOne()
  );
}

async function getAll (pageLimit = 10, pageNumber = 0) {
  return (await getRepository(List)
    .createQueryBuilder('list')
    .leftJoinAndSelect('list.repository', 'r')
    // .orderBy(`list.${orderBy}`, 'DESC')
    // https://github.com/typeorm/typeorm/issues/4270
    .skip(pageLimit * pageNumber)
    .take(pageLimit)
    .getMany()).map(utils.deserializeList);
}

async function getCount () {
  const result = await getRepository(List)
    .query('SELECT COUNT(*) as c FROM list');
  return parseInt(result[0].c);
}

async function getAllTopics (page = 0, limit = 50) {
  // split keywords into arrays
  // remove repeated keywords with set constructor
  return [...new Set((await getRepository(Repository)
    .createQueryBuilder('repo')
    .select('repo.topics')
    .distinct(true)
    .where('CHAR_LENGTH(repo.topics) > 1')
    .skip(page * limit)
    .take(limit)
    .getMany())
    .map(r => utils.split(r.topics)).flat())];
}

async function exists (uid) {
  try {
    await get(uid);
    return true;
  } catch (e) {
    if (e.message === AwesomeError.types.NOT_FOUND) {
      return false;
    } else {
      throw e;
    }
  }
}

async function removeAll () {
  await getRepository(Link).query('DELETE FROM link WHERE 1=1');
  await getRepository(List).query('DELETE FROM list WHERE 1=1');
  await getRepository(Repository).query('DELETE FROM repository WHERE 1=1');
  await getRepository(Website).query('DELETE FROM website WHERE 1=1');
}

module.exports = {
  save,
  get,
  removeAll,
  getAll,
  exists,
  getCount,
  search,
  getAllTopics
}
