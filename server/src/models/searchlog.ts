import UaParser from 'ua-parser-js';

export default class SearchLog {

  query: string;
  userAgent: string;
  datetime: Date;

  constructor (query: string, userAgent: string, datetime?: Date) {
    this.query = query;
    this.userAgent = userAgent;
    this.datetime = datetime || new Date();
    this.datetime.setMilliseconds(0);
  }

  get browser () {
    return this._getParseResult().browser;
  }

  get device () {
    return this._getParseResult().device;
  }

  _getParseResult () {
    return new UaParser(this.userAgent).getResult();
  }

}
