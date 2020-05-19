const normalizeUrl = require('normalize-url');
const Result = require('./result');

class Link {

  constructor (url, source) {
    this.uid = null;
    this.url = null
    this.title = null;
    this.type = null;
    this.name = null;
    this.author = null;
    this.description = null;
    this.image = null;
    this.keywords = [];
    this.source = source || null;
    this.updated = null;

    if (url) {
      this.setUrl(url);
    }
  }

  setUrl (url) {
    this.url = normalizeUrl(url);
    this.uid = Link.computeUid(url);
  }

  /**
   * Removes fields that have undefined or null value.
   * Used for serialization before transporting to queue.
   */
  minify () {
    const keys = Object.keys(this);
    const result = {};
    for (let k of keys) {
      if (this[k] !== null && !(this[k] instanceof Array && this[k].length === 0)) {
        result[k] = this[k];
      }
    }
    return result;
  }

  serialize () {
    return new Result({
      uid: this.uid,
      type: Result.type.LINK,
      image: this.image,
      websiteName: this.name,
      websiteType: this.type,
      description: this.description,
      tags: this.keywords,
      source: this.source,
      author: this.author,
      title: this.title,
      url: this.url
    })
  }

  assign (obj) {
    obj && Object.assign(this, obj);
  }

  serializeToIndex () {
    const postfix = ' ';
    const serializeValue = v => v ? `${v}${postfix}` : '';
    return (
      serializeValue(this.title) +
      serializeValue(this.url) +
      serializeValue(this.description) +
      serializeValue(this.keywords.join(','))
    );
  }

  static fromObject (obj) {
    const website = new Link(obj.url);
    website.assign(obj);
    return website;
  }

  static fromJson (json) {
    const obj = JSON.parse(json);
    const website = new Link(obj.url);
    website.assign(obj);
    return website;
  }

  static computeUid (url) {
    const normalized = normalizeUrl(url, {
      stripHash: true,
      stripWWW: true,
      stripProtocol: true,
      removeTrailingSlash: true,
      removeQueryParameters: true
    });
    return normalized.replace(/\//g, '.');
  }

}

module.exports = Link;
