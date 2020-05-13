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
      const response = await fetch(`${process.env.REACT_APP_API_HOST}/search?q=${this.query}&p=${this.page}`);
      this.result = await response.json();
      return this.result.result;
    } else {
      return null;
    }
  }

  async run (query) {
    this.query = query;
    const fired = Date.now();
    const response = await fetch(`${process.env.REACT_APP_API_HOST}/search?q=${query}`);
    this.result = await response.json();
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
