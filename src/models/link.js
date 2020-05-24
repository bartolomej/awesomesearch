const Website = require('./website');

class Link {

  constructor (url, source, website, repository) {
    this.uid = null;
    this.url = null
    this.website = website || null;
    this.source = source || null;
    this.repository = repository || null;

    if (url) {
      this.setUrl(url);
    }
  }

  get type () {
    return 'link';
  }

  get image () {
    if (this.website) {
      return this.website.image;
    } else if (this.repository) {
      return this.repository.avatar;
    } else {
      return null;
    }
  }

  get title () {
    if (this.website) {
      return this.website.title;
    } else if (this.repository) {
      return this.repository.name;
    } else {
      return null;
    }
  }

  get screenshot () {
    return this.website ? this.website.screenshot : null
  }

  get websiteName () {
    return this.website ? this.website.name : null;
  }

  get websiteType () {
    return this.website ? this.website.type : null;
  }

  get description () {
    if (this.repository) {
      return this.repository.description;
    } else if (this.website) {
      return this.website.description;
    } else {
      return null;
    }
  }

  get author () {
    if (this.repository) {
      return this.repository.user;
    } else if (this.website) {
      return this.website.author;
    } else {
      return null;
    }
  }

  get tags () {
    if (this.repository) {
      return this.repository.topics;
    } else if (this.website) {
      return this.website.keywords;
    } else {
      return [];
    }
  }

  get emojis () {
    return this.repository ? this.repository.emojis : [];
  }

  setUrl (url) {
    this.url = Website.normalizeUrl(url);
    this.uid = Website.computeUid(url);
  }

  static createFromJson (json) {
    const obj = JSON.parse(json);
    return Object.assign(new Link(), obj);
  }

}

module.exports = Link;
