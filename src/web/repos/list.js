const { getRepository } = require('typeorm');
const Link = require('../../models/link');
const List = require('../../models/list');
const Website = require('../../models/website');
const Repository = require('../../models/repository');
const utils = require('./utils');

async function save (list) {
  await getRepository(Repository)
    .save(utils.serializeRepo(list.repository));
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

async function removeAll () {
  await getRepository(List).query('DELETE FROM list WHERE 1=1');
  await getRepository(Link).query('DELETE FROM link WHERE 1=1');
  await getRepository(Repository).query('DELETE FROM repository WHERE 1=1');
  await getRepository(Website).query('DELETE FROM website WHERE 1=1');
}

module.exports = {
  save,
  get,
  removeAll
}
