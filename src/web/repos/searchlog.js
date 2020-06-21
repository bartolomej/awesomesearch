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

async function getCount () {
  const res = await getRepository(SearchLog)
    .createQueryBuilder('l')
    .select('count(*) as c')
    .getRawOne();
  return parseInt(res.c);
}

async function getCountByQuery (start, end, page = 0, limit = 50) {
  const query = await getRepository(SearchLog)
    .createQueryBuilder('l')
    .select('l.query as q, count(*) as c')
    .groupBy('l.query')
  if (start) {
    query.where('l.datetime > :start', { start })
  }
  if (end) {
    query.andWhere('l.datetime < :end', { end })
  }
  const res = await query
    .limit(limit)
    .skip(page * limit)
    .orderBy('c', 'DESC')
    .getRawMany();
  return res.map(r => ({ query: r.q, count: parseInt(r.c) }));
}

async function getCountByDate (start, end, page = 0, limit = 50) {
  const query = await getRepository(SearchLog)
    .createQueryBuilder('l')
    .select('l.datetime as d, count(*) as c')
    .groupBy('l.datetime')
    .orderBy('l.datetime', 'DESC');
  if (start) {
    query.where('l.datetime > :start', { start })
  }
  if (end) {
    query.andWhere('l.datetime < :end', { end })
  }
  const res = await query
    .limit(limit)
    .skip(page * limit)
    .getRawMany();
  return res.map(r => ({ datetime: r.d, count: parseInt(r.c) }));
}

async function removeAll () {
  await getRepository(SearchLog).query('DELETE FROM search_log WHERE 1=1');
}

module.exports = {
  save,
  getSortedByDate,
  getCountByQuery,
  getCountByDate,
  getCount,
  removeAll
}
