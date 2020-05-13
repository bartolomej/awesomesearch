const normalizeUrl = require('normalize-url');
const Result = require('./result');

class Awesome {

  constructor (url, avatar, homepage, description, stars, forks, topics, urls) {
    this.url = url;
    this.avatar = avatar || null;
    this.homepage = homepage || null;
    this.description = description || null;
    this.stars = stars || null;
    this.forks = forks || null;
    this.topics = topics || null;
    this.urls = urls || [];
  }

  serialize () {
    return new Result({
      uid: this.url,
      links: this.urls,
      url: this.url,
      stars: this.stars,
      type: Result.type.REPOSITORY,
      forks: this.forks,
      image: this.avatar,
      description: this.description,
      title: `${this.getUser()}/${this.getRepository()}`,
      tags: this.topics
    })
  }

  get uid () {
    return this.url ? `${this.getUser()}/${this.getRepository()}` : null;
  }

  static fromObject (obj) {
    const awesome = new Awesome(obj.url);
    awesome.assign(obj);
    return awesome;
  }

  static fromJson (json) {
    const obj = JSON.parse(json);
    const awesome = new Awesome(obj.url);
    awesome.assign(obj);
    return awesome;
  }

  assign (obj) {
    obj && Object.assign(this, obj);
  }

  serializeToIndex () {
    const postfix = ' ';
    const serializeValue = v => v ? `${v}${postfix}` : '';
    return (
      serializeValue(this.homepage) +
      serializeValue(this.description) +
      serializeValue(this.url)
    )
  }

  getUser () {
    return Awesome.parseUrl(this.url).user;
  }

  getRepository () {
    return Awesome.parseUrl(this.url).repo;
  }

  // https://stackoverflow.com/questions/2219830/regular-expression-to-find-two-strings-anywhere-in-input
  static isValidUrl (url, isRoot = false) {
    return (
      /^http/.test(url) &&
      (!/^.*?\bgithub\b.*?\bawesome\b.*?$/m.test(url) || isRoot) &&
      !/creativecommons.org/.test(url)
    )
  }

  static parseUrl (url) {
    const uid = url
      .replace('https://www.github.com/', '')
      .replace('https://github.com/', '')
      .replace('#readme', '')
      .split('/');
    return {
      user: uid[0],
      repo: uid[1]
    }
  }

  static getUidFromUrl (url) {
    const parsed = Awesome.parseUrl(url);
    return `${parsed.user}/${parsed.repo}`;
  }

}

module.exports = Awesome;
