const normalizeUrl = require('normalize-url');

class Website {

  constructor (url, source) {
    this.url = url ? normalizeUrl(url) : null;
    this.title = null;
    this.type = null;
    this.name = null;
    this.author = null;
    this.description = null;
    this.image = null;
    this.keywords = [];
    this.source = source || null;
    this.updated = null;
  }

  get uid () {
    return this.url;
  }

  static fromObject (obj) {
    const website = new Website(obj.url);
    website.assign(obj);
    return website;
  }

  static fromJson (json) {
    const obj = JSON.parse(json);
    const website = new Website(obj.url);
    website.assign(obj);
    return website;
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

}

module.exports = Website;
