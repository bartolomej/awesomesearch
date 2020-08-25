const UaParser = require('ua-parser-js');

class SearchLog {

  constructor (query, userAgent, datetime) {
    this.query = query;
    this.userAgent = userAgent;
    this.datetime = datetime || new Date();
    this.datetime.setMilliseconds(0);
  }

  _getParseResult () {
    return new UaParser(this.userAgent).getResult();
  }

  get browser () {
    return this._getParseResult().browser;
  }

  get device () {
    return this._getParseResult().device;
  }

}

module.exports = SearchLog;
