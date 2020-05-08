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

  static async extractMetadata (html, websiteUrl) {
    const $ = cheerio.load(html);

    const metaTagsList = [
      name => $(`meta[name="${name}"]`).attr('content'),
      name => $(`meta[name="og:${name}"]`).attr('content'),
      name => $(`meta[name="twitter:${name}]"]`).attr('content'),
      name => $(`meta[name="twitter:${name}:src]"]`).attr('content'),
      name => $(`meta[property="${name}"]`).attr('content'),
      name => $(`meta[property="og:${name}"]`).attr('content'),
      name => $(`meta[property="twitter:${name}]"]`).attr('content'),
      name => $(`meta[property="twitter:${name}:src]"]`).attr('content')
    ];

    const imageMetaTagsList = [
      ...metaTagsList,
      () => $('link[rel=icon]').attr('href'),
      () => $('link[rel="shortcut icon"]').attr('href'),
      () => $('link[rel=shortcut-icon]').attr('href'),
      () => $('link[rel=mack-icon]').attr('href')
    ];

    const getMetaTag = name => {
      for (let tag of metaTagsList) {
        if (tag(name)) {
          return tag(name);
        }
      }
      return null;
    }

    let image = null;
    let title = getMetaTag('title') || $('title').first().text();
    let url = websiteUrl || getMetaTag('url');
    let type = getMetaTag('type');
    let name = getMetaTag('site_name');
    let description = getMetaTag('description');
    let author = getMetaTag('author');
    let keywords = getMetaTag('keywords')
      ? getMetaTag('keywords')
        .split(',')
        .map(k => k.trim())
        .filter(value => value.length > 0)
      : [];

    // generate image url candidates
    const imageUrlCandidates = imageMetaTagsList.map(tagCb => {
      let imageUrl = tagCb('image');
      if (isRelativeUrl(imageUrl)) {
        imageUrl = parseRelativeUrl(url, imageUrl);
      }
      return imageUrl;
    });

    // test urls by fetching resources with http
    const imageUrlResults = await Promise.all(
      imageUrlCandidates.map(isResourceAvailable)
    );

    // select first ok candidate
    for (let i = 0; i < imageUrlResults.length; i++) {
      if (imageUrlResults[i] === true) {
        image = imageUrlCandidates[i];
        break;
      }
    }

    return { title, type, name, description, author, image, url, keywords };
  }

}

const isRelativeUrl = url => (
  url !== undefined &&
  url !== null &&
  !/http/.test(url)
);

const isResourceAvailable = async url => {
  if (url !== undefined) {
    const response = await fetch(url);
    return response.ok;
  } else {
    return false;
  }
}

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
