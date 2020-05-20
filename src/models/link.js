const Result = require('./result');
const Website = require('./website');

class Link {

  constructor (url, source, website, repository) {
    this.url = null
    this.website = website || null;
    this.source = source || null;
    this.repository = repository || null;
    this.updated = null;

    if (url) {
      this.setUrl(url);
    }
  }

  get image () {
    return this.website ? this.website.image : this.repository.avatar
  }

  get title () {
    return this.website ? this.website.title : this.repository.getName()
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

  get screenshot () {
    return this.website ? this.website.screenshot : null
  }

  get websiteName () {
    return this.website ? this.website.name : null;
  }

  get websiteType () {
    return this.website ? this.website.type : null;
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

  setUrl (url) {
    this.url = Website.normalizeUrl(url);
    this.uid = Website.computeUid(url);
  }

  serialize () {
    return new Result({
      uid: this.uid,
      type: Result.type.LINK,
      image: this.image,
      screenshotImage: this.screenshot,
      websiteName: this.websiteName,
      websiteType: this.websiteType,
      description: this.description,
      objectType: Result.type.LINK,
      tags: this.tags,
      source: this.source,
      author: this.author,
      title: this.title,
      url: this.url
    })
  }

  serializeToIndex () {
    const postfix = ' ';
    const serializeValue = v => v ? `${v}${postfix}` : '';
    return (
      serializeValue(this.title) +
      serializeValue(this.url) +
      serializeValue(this.description) +
      serializeValue(this.tags.join(','))
    );
  }

  static createFromJson (json) {
    const obj = JSON.parse(json);
    return Object.assign(new Link(), obj);
  }

}

module.exports = Link;
