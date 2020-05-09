const normalizeUrl = require('normalize-url');

class Website {

  constructor (url) {
    this.uid = url;
    this.url = url ? normalizeUrl(url) : null;
    this.title = null;
    this.type = null;
    this.name = null;
    this.author = null;
    this.description = null;
    this.image = null;
    this.keywords = [];
    this.source = null;
    this.updated = null;
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
