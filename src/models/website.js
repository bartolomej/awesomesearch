const cheerio = require('cheerio');
const normalizeUrl = require('normalize-url');
const uuid = require('uuid').v4;
const fetch = require('node-fetch');

class Website {

  constructor (url) {
    if (typeof url !== 'string') {
      throw new Error(`Website url is not string`);
    }
    this.uid = uuid();
    this.url = normalizeUrl(url);
    this.title = null;
    this.type = null;
    this.name = null;
    this.author = null;
    this.description = null;
    this.image = null;
    this.keywords = [];
    this.updated = null;
  }

  setMetadata (metadata) {
    this.title = metadata.title;
    this.type = metadata.type;
    this.author = metadata.author;
    this.description = metadata.description;
    this.image = metadata.image;
    this.keywords = metadata.keywords;
    this.name = metadata.name;
    this.url = metadata.url ? normalizeUrl(metadata.url) : this.url;
    this.updated = new Date();
  }

}

module.exports = Website;
