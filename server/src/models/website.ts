const normalizeUrlLib = require('normalize-url');
import { v5 as uuidv5 } from 'uuid';

export default class Website {

  uid: string;
  url: string;
  title: string;
  type: string;
  name: string;
  description: string;
  author: string;
  icon: string;
  image: string;
  screenshot: string;
  screenshotId: string;
  keywords: Array<string>;

  constructor (url, title?) {
    this.uid = null;
    this.url = null;
    this.title = title || null;
    this.type = null;
    this.name = null;
    this.description = null;
    this.author = null;
    this.icon = null;
    this.image = null;
    this.screenshot = null;
    this.screenshotId = null;
    this.keywords = [];

    if (url) {
      this.setUrl(url)
    }
  }

  static normalizeUrl (url) {
    return normalizeUrlLib(url, {
      removeTrailingSlash: true,
      stripHash: true,
      stripWWW: true,
    })
  }

  setUrl (url) {
    this.url = Website.normalizeUrl(url);
    this.uid = uuidv5(this.url, uuidv5.URL);
  }

}
