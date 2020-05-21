const { getRepository } = require('typeorm');
const utils = require('./utils');
const Link = require('../../models/link');
const Website = require('../../models/website');
const Repository = require('../../models/repository');

async function save (link) {
  if (link.website) {
    await getRepository(Website)
      .save(utils.serializeWebsite(link.website));
  }
  if (link.repository) {
    await getRepository(Repository)
      .save(utils.serializeRepo(link.repository));
  }
  return getRepository(Link).save(link);
}

async function get (uid) {
  return utils.deserializeLink(
    await getRepository(Link)
      .createQueryBuilder('link')
      .leftJoinAndSelect('link.repository', 'repository')
      .leftJoinAndSelect('link.website', 'website')
      .where('link.uid = :uid', { uid })
      .getOne()
  );
}

async function getFromSource (sourceUid) {
  return (await getRepository(Link)
    .createQueryBuilder('link')
    .leftJoinAndSelect('link.repository', 'repository')
    .leftJoinAndSelect('link.website', 'website')
    .where('link.source = :sourceUid', { sourceUid })
    .getMany()).map(utils.deserializeLink)
}

async function getAll (pageLimit = 10, pageNumber = 0, source = null) {
  const query = getRepository(Link)
    .createQueryBuilder('link')
    .leftJoinAndSelect('link.repository', 'repository')
    .leftJoinAndSelect('link.website', 'website')
  if (source) {
    query.where('link.source =: source', { source })
  }
  query
    .skip(pageNumber * pageLimit)
    .take(pageLimit);
  return (await query.getMany()).map(utils.deserializeLink);
}

async function getCount () {
  const result = await getRepository(Link)
    .query('SELECT COUNT(*) as c FROM link');
  return parseInt(result[0].c);
}

async function exists (uid) {
  try {
    await get(uid);
    return true;
  } catch (e) {
    if (e.message === 'Object not found') {
      return false;
    }
  }
}

module.exports = {
  save,
  get,
  getFromSource,
  getCount,
  getAll,
  exists
}
