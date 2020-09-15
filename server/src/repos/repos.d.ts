import Link from "../models/link";
import List from '../models/list';
import SearchLog from "../models/searchlog";
import { SearchLogQueryParams } from "./searchlog";

interface ListQueryParams {
  query: string;
  limit?: number;
  page?: number;
}

interface LinkQueryParams extends ListQueryParams {
  listUid?: string;
}

export interface LinkRepositoryInt {
  search (q: LinkQueryParams): Promise<Array<Link>>;

  countSearchResults (query: string, listUid?: string): Promise<number>;

  save (link: Link): Promise<Link>;

  get (uid: string): Promise<Link>;

  getFromSource (source: string): Promise<Array<Link>>;

  getAll (limit?: number, page?: number, source?: string): Promise<Array<Link>>;

  getCount (source?: string): Promise<number>;

  getRandomObject (count?: number): Promise<Array<Link>>;

  getAllKeywords (limit?: number, page?: number): Promise<Array<string>>;

  exists (uid: string): Promise<boolean>;
}

export interface ListRepositoryInt {
  search (q: ListQueryParams): Promise<Array<List>>;

  countSearchResults (query: string): Promise<number>;

  save (list: List): Promise<List>;

  get (uid: string): Promise<List>;

  getAll (limit: number, page: number): Promise<Array<List>>;

  getCount (): Promise<number>;

  getAllTopics (page?: number, limit?: number): Promise<Array<string>>;

  exists (uid: string): Promise<boolean>;
}

export interface SearchLogRepositoryInt {
  save (log: SearchLog): Promise<SearchLog>;

  getTotalCount (): Promise<number>;

  getSortedByDate (obj: SearchLogQueryParams): Promise<Array<SearchLog>>;

  getCountByQuery (obj: SearchLogQueryParams): Promise<Array<QueryCountStats>>;

  getCountByDate (obj: SearchLogQueryParams): Promise<Array<DateCountStats>>;
}

export interface QueryCountStats {
  query: string;
  count: number;
}

export interface DateCountStats {
  datetime: Date;
  count: number;
}
