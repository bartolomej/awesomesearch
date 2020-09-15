import { ListRepositoryInt } from "./repos";
import logger from "../logger";
import List from "../models/list";
import Repository from "../models/repository";
import { ERROR_MSG_NOT_FOUND, TYPEORM_DUP_ENTRY_CODE } from "../constants";

const { getRepository } = require('typeorm');
const utils = require('./utils');

export default function ListRepository (): ListRepositoryInt {

  const log = logger('list-repository');

  async function search ({ query, limit = 20, page = 0 }): Promise<Array<List>> {
    return (await getRepository(List)
        .createQueryBuilder('list')
        .leftJoinAndSelect('list.repository', 'r')
        // TODO: test IN NATURAL LANGUAGE MODE WITH QUERY EXPANSION
        .where(`
        MATCH(r.url, r.homepage, r.description, r.topics)
        AGAINST ('${query}')
      `)
        .skip(limit * page)
        .take(limit)
        .getMany()
    ).map(utils.deserializeList);
  }

  async function countSearchResults (query: string) {
    const sqlQuery = getRepository(List)
      .createQueryBuilder('list')
      .select('COUNT(list.uid)', 'count')
      .leftJoin('list.repository', 'r')
      .where(`
        MATCH(r.url, r.homepage, r.description, r.topics)
        AGAINST ('${query}')
      `)
    const result = await sqlQuery.execute()
    return parseInt(result[0].count);
  }

  async function save (list: List): Promise<List> {
    await getRepository(Repository)
      .save(utils.serializeRepo(list.repository))
      .catch(e => {
        if (new RegExp(TYPEORM_DUP_ENTRY_CODE).test(e.message)) {
          log.info(`Repository ${list.repository.uid} exists in db.`);
        } else {
          throw e;
        }
      });
    return getRepository(List).save(list);
  }

  async function get (uid: string): Promise<List> {
    return utils.deserializeList(
      await getRepository(List)
        .createQueryBuilder('list')
        .leftJoinAndSelect('list.repository', 'r')
        .where('list.uid = :uid', { uid })
        .getOne()
    );
  }

  async function getAll (limit: number, page: number): Promise<Array<List>> {
    return (await getRepository(List)
      .createQueryBuilder('list')
      .leftJoinAndSelect('list.repository', 'r')
      // .orderBy(`list.${orderBy}`, 'DESC')
      // https://github.com/typeorm/typeorm/issues/4270
      .skip(limit * page)
      .take(limit)
      .getMany()).map(utils.deserializeList);
  }

  async function getCount (): Promise<number> {
    const result = await getRepository(List)
      .query('SELECT COUNT(*) as c FROM list');
    return parseInt(result[0].c);
  }

  async function getAllTopics (page: number = 0, limit: number = 20): Promise<Array<string>> {
    // split keywords into arrays
    // remove repeated keywords with set constructor
    // @ts-ignore
    return [...new Set((await getRepository(Repository)
      .createQueryBuilder('repo')
      .select('repo.topics')
      .distinct(true)
      .where('CHAR_LENGTH(repo.topics) > 1')
      .skip(page * limit)
      .take(limit)
      .orderBy('repo.topics', 'ASC')
      .getMany())
      .map(r => utils.split(r.topics)).flat())];
  }

  async function exists (uid: string): Promise<boolean> {
    try {
      await get(uid);
      return true;
    } catch (e) {
      if (e.message === ERROR_MSG_NOT_FOUND) {
        return false;
      } else {
        throw e;
      }
    }
  }

  return {
    save,
    get,
    getAll,
    exists,
    getCount,
    search,
    getAllTopics,
    countSearchResults
  }
}
