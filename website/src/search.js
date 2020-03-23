export default class Search {

  constructor () {
    this.lastResult = null;
  }

  async run (query) {
    const fired = Date.now();
    const response = await fetch(`${process.env.REACT_APP_API_HOST}/search?q=${query}`);
    const result = await response.json();
    if (!this.lastResult) {
      this.lastResult = { fired, result };
      return result;
    } else if (this.lastResult.fired < fired) {
      this.lastResult = { fired, result };
      return result;
    } else {
      console.log(`Query ${query} expired`);
      return null;
    }
  }

}
