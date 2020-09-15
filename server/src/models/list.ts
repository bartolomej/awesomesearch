import Repository from './repository';
import { v5 as uuidv5 } from 'uuid';

export default class List {

  uid: string;
  url: string;
  urls: Array<string>;
  repository: Repository;

  constructor (url: string, repository: Repository, urls?: any) {
    this.uid = null;
    this.url = url;
    this.repository = repository || null;
    // TODO: add website (if homepage exist)
    // @ts-ignore
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
    // @ts-ignore
    return Object.assign(new List(), obj);
  }

  setUrl (url: string) {
    this.url = Repository.normalizeUrl(url);
    this.uid = uuidv5(this.url, uuidv5.URL);
  }

}
