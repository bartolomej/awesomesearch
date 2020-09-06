const normalizeUrl = require('normalize-url');

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
    return this.uid.split('.')[0];
  }

  get name () {
    return this.uid.split('.')[1];
  }

  static isGithubRepository (url) {
    return /github.com/.test(url);
  }

  static parseUrl (url) {
    const parsed = normalizeUrl(url, {
      stripWWW: true,
      stripProtocol: true,
      stripHash: true,
      removeTrailingSlash: true
    })
      .replace('github.com/', '')
      .split('/');
    return { user: parsed[0], name: parsed[1] }
  }

  static parseUid (url) {
    const { user, name } = Repository.parseUrl(url);
    return `${user}.${name}`;
  }

  setUrl (url) {
    this.url = normalizeUrl(url, {
      stripWWW: true,
      stripHash: true,
      removeTrailingSlash: true
    });
    this.uid = Repository.parseUid(url);
  }

}
