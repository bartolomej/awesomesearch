const { getRepository } = require('typeorm');
const utils = require('./utils');
const Link = require('../../models/link');
const Website = require('../../models/website');
const Repository = require('../../models/repository');
const AwesomeError = require('../../errors');

async function save (link) {
  if (link.website) {
    await getRepository(Website)
      .save(utils.serializeWebsite(link.website))
      .catch(e => {
        if (/ER_DUP_ENTRY/.test(e.message)) {
          throw new AwesomeError(
            AwesomeError.types.DUPLICATE_ENTRY,
            `Link website ${link.website.uid} exists.`
          )
        } else {
          throw e;
        }
      });
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

async function getRandomObject (n = 1) {
  return (await getRepository(Link)
    .createQueryBuilder('link')
    .leftJoinAndSelect('link.repository', 'repository')
    .leftJoinAndSelect('link.website', 'website')
    .take(n)
    .orderBy('RAND()')
    .getMany()).map(utils.deserializeLink)
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

module.exports = {
  save,
  get,
  getFromSource,
  getCount,
  getAll,
  exists,
  getRandomObject
}
