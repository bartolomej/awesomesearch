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

  get type () {
    return 'list';
  }

  get title () {
    return this.repository ? this.repository.name : null;
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

  get image () {
    return this.repository ? this.repository.image : null;
  }

  get websiteName () {
    return 'Github';
  }

  get emojis () {
    return this.repository ? this.repository.emojis : [];
  }

  setUrl () {
    this.uid = Repository.parseUid(this.url);
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
