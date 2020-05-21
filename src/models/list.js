const Result = require('./result');
const Repository = require('./repository');


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
    return this.repository ? `${this.repository.user}/${this.repository.name}` : null;
  }

  get tags () {
    return this.repository ? this.repository.topics : [];
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
    const postfix = ' ';
    const serializeValue = v => v ? `${v}${postfix}` : '';
    return (
      serializeValue(this.repository.homepage) +
      serializeValue(this.repository.description) +
      serializeValue(this.url)
    )
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
