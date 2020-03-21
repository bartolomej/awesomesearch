const cheerio = require('cheerio');
const normalizeUrl = require('normalize-url');
const uuid = require('uuid').v4;

class Website {

  constructor (url) {
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

  scrape (html) {
    const metadata = Website.extractMetadata(html);
    this.title = metadata.title;
    this.type = metadata.type;
    this.author = metadata.author;
    this.description = metadata.description;
    this.image = metadata.image;
    this.keywords = metadata.keywords;
    this.name = metadata.name;
    this.url = normalizeUrl(metadata.url) || this.url;
    this.updated = new Date();
  }

  static extractMetadata (html) {
    const $ = cheerio.load(html);

    const getMetaTag = name => (
      $(`meta[name="${name}"]`).attr('content') ||
      $(`meta[name="og:${name}"]`).attr('content') ||
      $(`meta[name="twitter:${name}]"]`).attr('content') ||
      $(`meta[name="twitter:${name}:src]"]`).attr('content') ||
      $(`meta[property="${name}"]`).attr('content') ||
      $(`meta[property="og:${name}"]`).attr('content') ||
      $(`meta[property="twitter:${name}]"]`).attr('content') ||
      $(`meta[property="twitter:${name}:src]"]`).attr('content') || null
    );

    let title = getMetaTag('title') || $('title').first().text();
    let url = getMetaTag('url');
    let type = getMetaTag('type');
    let name = getMetaTag('site_name');
    let description = getMetaTag('description');
    let author = getMetaTag('author');
    let keywords = getMetaTag('keywords') ? getMetaTag('keywords').split(',').map(k => k.trim()) : [];
    let image =
      getMetaTag('image') ||
      $('link[rel=icon]').attr('href') ||
      $('link[rel="shortcut icon"]').attr('href') ||
      $('link[rel=shortcut-icon]').attr('href') ||
      $('link[rel=mack-icon]').attr('href');

    if (isRelativeUrl(image)) {
      image = parseRelativeUrl(url, image);
    }

    return { title, type, name, description, author, image, url, keywords };
  }

}

const isRelativeUrl = url => (
  url !== undefined &&
  url !== null &&
  !/http/.test(url)
);

const parseRelativeUrl = (indexUrl, url) => {
  let urlEndIndex = indexUrl.indexOf('/', 8);
  if (urlEndIndex > 0) {
    return indexUrl.substring(0, urlEndIndex) + url;
  } else {
    let suffixUrl = url[0] === '/' ? url : '/' + url;
    return indexUrl.substring(0, indexUrl.length) + suffixUrl;
  }
};

module.exports = Website;
