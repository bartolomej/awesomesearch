import {
  DateCountStats,
  QueryCountStats,
  SearchLogRepositoryInt
} from "./repos";

import { getRepository } from 'typeorm';
import SearchLog from "../../models/searchlog";

export interface SearchLogQueryParams {
  start?: Date;
  end?: Date;
  page?: number;
  limit?: number;
}

export default function SearchLogRepository (): SearchLogRepositoryInt {

  async function save (log: SearchLog): Promise<SearchLog> {
    return await getRepository(SearchLog).save(log);
  }

  async function getSortedByDate (
    { start, end, page = 0, limit = 20 }: SearchLogQueryParams
  ): Promise<Array<SearchLog>> {
    const query = await getRepository(SearchLog)
      .createQueryBuilder('l')

    if (start) {
      query.where('l.datetime > :start', { start })
    }
    if (end) {
      query.andWhere('l.datetime < :end', { end })
    }

    return await query
      .limit(limit)
      .skip(page * limit)
      .getMany();
  }

  async function getTotalCount (): Promise<number> {
    const res = await getRepository(SearchLog)
      .createQueryBuilder('l')
      .select('count(*) as c')
      .getRawOne();
    return parseInt(res.c);
  }

  async function getCountByQuery (
    { start, end, page = 0, limit = 20 }: SearchLogQueryParams
  ): Promise<Array<QueryCountStats>> {
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

  async function getCountByDate (
    { start, end, page = 0, limit = 20 }: SearchLogQueryParams
  ): Promise<Array<DateCountStats>> {
    const query = await getRepository(SearchLog)
      .createQueryBuilder('l')
      .select('DATE(l.datetime) as d, count(*) as c') // cast datetime to date
      .groupBy('d')
      .orderBy('d', 'DESC');
    if (start) {
      query.where('DATE(l.datetime) > :start', { start })
    }
    if (end) {
      query.andWhere('DATE(l.datetime) < :end', { end })
    }
    const res = await query
      .limit(limit)
      .skip(page * limit)
      .getRawMany();
    return res.map(r => ({ datetime: r.d, count: parseInt(r.c) }));
  }

  return {
    save,
    getTotalCount,
    getCountByDate,
    getCountByQuery,
    getSortedByDate
  }

}
