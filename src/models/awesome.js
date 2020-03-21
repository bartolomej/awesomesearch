const unified = require('unified');
const markdown = require('remark-parse');
const normalizeUrl = require('normalize-url');
const { select, selectAll } = require("unist-util-select");
const Website = require('./website');

class Awesome {

  constructor (url) {
    this.url = normalizeUrl(url);
    this.uid = `${this.getUser()}/${this.getRepository()}`;
    this.website = new Website(url);
    this.urls = [];
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
      const title = select('link > text', link);
      if (title && /http/.test(link.url)) {
        urls.push(normalizeUrl(link.url));
      }
    }
    return urls;
  }

}

module.exports = Awesome;
