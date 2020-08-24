const { getRepository } = require('typeorm');
const utils = require('./utils');
const Link = require('../../models/link');
const Website = require('../../models/website');
const Repository = require('../../models/repository');
const AwesomeError = require('../../error');

async function search (query, pageLimit = 10, pageNumber = 0) {
  return (await getRepository(Link)
    .createQueryBuilder('link')
    .leftJoinAndSelect('link.repository', 'r')
    .leftJoinAndSelect('link.website', 'w')
    // TODO: try mode: NATURAL LANGUAGE MODE WITH QUERY EXPANSION
    .where(`
      MATCH(w.url, w.title, w.name, w.description, w.author, w.keywords) 
      AGAINST ('${query}' IN NATURAL LANGUAGE MODE)
    `)
    .skip(pageLimit * pageNumber)
    .take(pageLimit)
    .getMany()
  ).map(utils.deserializeLink);
}

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

async function getAll (limit = 10, page = 0, source = null) {
  const query = getRepository(Link)
    .createQueryBuilder('link')
    .leftJoinAndSelect('link.repository', 'repository')
    .leftJoinAndSelect('link.website', 'website')
  if (source) {
    query.where('link.source = :source', { source })
  }
  query
    .skip(page * limit)
    .take(limit);
  return (await query.getMany()).map(utils.deserializeLink);
}

async function getCount (sourceUid) {
  const result = await getRepository(Link)
    .query(`SELECT COUNT(*) as c FROM link ${sourceUid ? `WHERE source = '${sourceUid}'` : ''}`);
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

async function getAllKeywords (limit = 100, page = 0) {
  // split keywords into arrays
  // remove repeated keywords with set constructor
  return [...new Set((await getRepository(Website)
    .createQueryBuilder('w')
    .select('w.keywords')
    .distinct(true)
    .where('CHAR_LENGTH(w.keywords) > 1')
    .skip(page * limit)
    .take(limit)
    .getMany())
    .map(l => utils.split(l.keywords)).flat())];
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
  getRandomObject,
  getAllKeywords,
  search
}
