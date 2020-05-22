const Result = require('./result');
const Repository = require('./repository');
const IndexObject = require('./index-object');


class List {

  constructor (url, repository, urls) {
    this.uid = null;
    this.url = url;
    this.repository = repository || null;
    // TODO: add website (if homepage exist)
    this.urls = urls || [];

    if (url) {
      this.setUrl(url);
    }
  }

  get title () {
    return this.repository ? this.repository.name: null;
  }

  get tags () {
    return this.repository ? this.repository.topics : [];
  }

  get author () {
    return this.repository ? this.repository.user : null;
  }

  get stars () {
    return this.repository ? this.repository.stars : null;
  }

  get forks () {
    return this.repository ? this.repository.forks : null;
  }

  get description () {
    return this.repository ? this.repository.description : null
  }

  setUrl () {
    this.uid = Repository.parseUid(this.url);
  }

  serialize () {
    return new Result({
      uid: this.uid,
      links: this.urls,
      url: this.url,
      stars: this.stars,
      type: Result.type.LIST,
      forks: this.forks,
      image: this.repository.avatar,
      description: this.description,
      title: this.title,
      tags: this.tags
    })
  }

  serializeToIndex () {
    return new IndexObject({
      uid: this.uid,
      title: this.title,
      tags: this.tags,
      description: this.description,
      author: this.author,
      websiteName: 'Github',
      url: this.url,
      type: 'list'
    });
  }

  static isValidUrl (url, isRoot = false) {
    return (
      /^http/.test(url) &&
      (!/^.*?\bgithub\b.*?\bawesome\b.*?$/m.test(url) || isRoot) &&
      !/creativecommons.org/.test(url) &&
      !/license/i.test(url)
    )
  }

  static createFromJson (json) {
    const obj = JSON.parse(json);
    return Object.assign(new List(), obj);
  }


}

module.exports = List;
