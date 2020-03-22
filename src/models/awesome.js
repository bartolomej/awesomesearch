const unified = require('unified');
const markdown = require('remark-parse');
const normalizeUrl = require('normalize-url');
const { selectAll } = require("unist-util-select");

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
    this.stars = attributes.stars || null;
    this.topics = attributes.topics || null;
    this.forks = attributes.forks || null;
    this.homepage = attributes.homepage || null;
  }

  getUser () {
    return Awesome.parseUrl(this.url).user;
  }

  getRepository () {
    return Awesome.parseUrl(this.url).repo;
  }

  updateUrls (markdown) {
    const newLinks = [];
    const urls = Awesome.parseReadme(markdown);
    for (let url of urls) {
      if (!this.containsUrl(url)) {
        newLinks.push(url);
      }
    }
    this.urls.push(...newLinks);
    return newLinks;
  }

  containsUrl (url) {
    for (let link of this.urls) {
      if (link.url === url) {
        return true;
      }
    }
    return false;
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

  static parseReadme (text) {
    const tree = unified().use(markdown).parse(text);
    let urls = [];
    const links = selectAll('link', tree);
    for (let link of links) {
      if (/http/.test(link.url)) {
        urls.push(normalizeUrl(link.url));
      }
    }
    return urls;
  }

}

module.exports = Awesome;
