const { getRepository } = require('typeorm');
const Link = require('../../models/link');
const List = require('../../models/list');
const Website = require('../../models/website');
const Repository = require('../../models/repository');
const utils = require('./utils');
const logger = require('../../logger')('list-repo');
const AwesomeError = require('../../errors');

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
      .leftJoinAndSelect('list.repository', 'repository')
      .where('list.uid = :uid', { uid })
      .getOne()
  );
}

async function getAll (pageLimit = 10, pageNumber = 0, orderBy = 'stars') {
  return (await getRepository(List)
    .createQueryBuilder('list')
    .leftJoinAndSelect('list.repository', 'repository')
    // .orderBy(`list.${orderBy}`, 'DESC')
    // https://github.com/typeorm/typeorm/issues/4270
    .skip(pageNumber)
    .take(pageLimit)
    .getMany()).map(utils.deserializeList);
}

async function getCount () {
  const result = await getRepository(List)
    .query('SELECT COUNT(*) as c FROM list');
  return parseInt(result[0].c);
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
  getCount
}
