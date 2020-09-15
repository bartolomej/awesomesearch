const normalizeUrlLib = require('normalize-url');
const gh = require('parse-github-url');
import { v5 as uuidv5 } from 'uuid';

export default class Repository {

  uid: string;
  avatar: string;
  url: string;
  homepage: string;
  description: string;
  stars: number;
  forks: number;
  readme: string;
  topics: Array<string>;

  constructor (url: string) {
    this.uid = null;
    this.avatar = null;
    this.url = null;
    this.homepage = null;
    this.description = null;
    this.stars = null;
    this.forks = null;
    this.readme = null;
    this.topics = [];

    if (url) {
      this.setUrl(url);
    }
  }

  /**
   * Parses emoji tokens in description.
   */
  get emojis () {
    let results = [];
    if (!this.description) {
      return results;
    }
    const matches = [...this.description.matchAll(/:*:/g)];
    for (let i = 0; i <= matches.length - 2; i += 2) {
      const start = matches[i].index + 1;
      const end = matches[i + 1].index;
      results.push(this.description.substring(start, end));
    }
    return results;
  }

  get image () {
    return this.avatar;
  }

  get user () {
    return Repository.parseUrl(this.url).user;
  }

  get name () {
    return Repository.parseUrl(this.url).name;
  }

  static isGithubRepository (url) {
    return /github.com/.test(url);
  }

  static parseUrl (url) {
    const normalized = Repository.normalizeUrl(url, {
      stripWWW: true,
      stripHash: true
    });
    const parsed = gh(normalized);
    return {
      user: parsed.owner,
      name: parsed.name
    }
  }

  static normalizeUrl (url, opts?) {
    return normalizeUrlLib(url, {
      stripWWW: true,
      removeTrailingSlash: true,
      ...opts
    });
  }

  setUrl (url) {
    this.url = Repository.normalizeUrl(url);
    this.uid = uuidv5(this.url, uuidv5.URL);
  }

}
