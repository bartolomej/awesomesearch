const { getRepository } = require('typeorm');
const SearchLog = require('../../models/searchlog');

async function save (log) {
  return await getRepository(SearchLog).save(log);
}

async function getSortedByDate (page = 0, limit = 20) {
  return await getRepository(SearchLog)
    .createQueryBuilder('l')
    .limit(limit)
    .skip(page * limit)
    .getMany();
}

async function getCountByQuery (page = 0, limit = 20) {
  const res = await getRepository(SearchLog)
    .createQueryBuilder('l')
    .select('l.query as q, count(*) as c')
    .groupBy('l.query')
    .limit(limit)
    .skip(page * limit)
    .getRawMany();
  return res.map(r => ({ query: r.q, count: parseInt(r.c) }));
}

async function removeAll () {
  await getRepository(SearchLog).query('DELETE FROM search_log WHERE 1=1');
}

module.exports = {
  save,
  getSortedByDate,
  getCountByQuery,
  removeAll
}
