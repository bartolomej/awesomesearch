import { search } from "./api";


export default class Search {

  constructor () {
    this.lastResult = null;
    this.result = null;
    this.page = 0;
    this.query = null;
  }

  isNextPage () {
    return this.result.next !== null;
  }

  async nextPage () {
    if (this.result.next !== null) {
      this.page++;
      this.result = await search(this.query, this.page);
      return this.result.result;
    } else {
      return null;
    }
  }

  async run (query) {
    this.query = query;
    const fired = Date.now();
    this.result = await search(query);
    if (!this.lastResult) {
      this.lastResult = { fired, result: this.result };
      return this.result.result;
    } else if (this.lastResult.fired < fired) {
      this.lastResult = { fired, result: this.result };
      return this.result.result;
    } else {
      console.log(`Query ${query} expired`);
      return null;
    }
  }

}
