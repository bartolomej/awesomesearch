const unified = require('unified');
const markdown = require('remark-parse');
const normalizeUrl = require('normalize-url');
const { selectAll } = require("unist-util-select");
const logger = require('../logger')('awesome-model');

class Awesome {

  constructor (url) {
    this.url = normalizeUrl(url);
    this.avatar = null;
    this.homepage = null;
    this.description = null;
    this.stars = null;
    this.forks = null;
    this.topics = null;
    this.uid = `${this.getUser()}/${this.getRepository()}`;
    this.urls = [];
  }

  setInfo (attributes) {
    this.description = attributes.description || null;
    this.avatar = attributes.avatar || null;
    this.stars = attributes.stars;
    this.topics = attributes.topics || null;
    this.forks = attributes.forks;
    this.homepage = attributes.homepage || null;
  }

  getUser () {
    return Awesome.parseUrl(this.url).user;
  }

  getRepository () {
    return Awesome.parseUrl(this.url).repo;
  }

  updateUrls (markdown) {
    this.urls = Awesome.parseReadme(markdown);
    return this.urls;
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
    const parsed = this.parseUrl(url);
    return `${parsed.user}/${parsed.repo}`;
  }

  static parseReadme (text, isRoot = false) {
    const tree = unified().use(markdown).parse(text);
    let urls = [];
    const links = selectAll('link', tree);
    for (let link of links) {
      if (this.isValidUrl(link.url, isRoot)) {
        try {
          urls.push(normalizeUrl(link.url));
        } catch (e) {
          logger.info(`Invalid url ${link.url} on normalization`);
        }
      }
    }
    return urls;
  }

  // https://stackoverflow.com/questions/2219830/regular-expression-to-find-two-strings-anywhere-in-input
  static isValidUrl (url, isRoot = false) {
    return (
      /^http/.test(url) &&
      (!/^.*?\bgithub\b.*?\bawesome\b.*?$/m.test(url) || isRoot) &&
      !/creativecommons.org/.test(url)
    )
  }

}

module.exports = Awesome;
