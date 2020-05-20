const normalizeUrl = require('normalize-url');

class Repository {

  constructor (url) {
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

  setUrl (url) {
    this.url = normalizeUrl(url, {
      stripWWW: true,
      stripHash: true,
      removeTrailingSlash: true
    });
    const { user, name } = Repository.parseUrl(url);
    this.uid = `${user}.${name}`;
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

}

module.exports = Repository;
