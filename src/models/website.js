const normalizeUrlLib = require('normalize-url');


class Website {

  constructor (url, title) {
    this.uid = null;
    this.title = title || null;
    this.type = null;
    this.name = null;
    this.description = null;
    this.author = null;
    this.image = null;
    this.screenshot = null;
    this.screenshotId = null;
    this.keywords = [];

    if (url) {
      this.setUrl(url)
    }
  }

  setUrl (url) {
    this.url = Website.normalizeUrl(url);
    this.uid = Website.computeUid(url);
  }

  static normalizeUrl (url) {
    return normalizeUrlLib(url, {
      removeTrailingSlash: true,
      stripHash: true,
      stripWWW: true,
    })
  }

  static computeUid (url) {
    const normalized = normalizeUrlLib(url, {
      stripHash: true,
      stripWWW: true,
      stripProtocol: true,
      removeTrailingSlash: true,
      removeQueryParameters: true
    });
    return normalized.replace(/\//g, '.');
  }

}

module.exports = Website;
