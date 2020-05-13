const OBJECT_TYPE = {
  LINK: 'link',
  REPOSITORY: 'repo'
}

class Result {

  constructor ({ uid, type, url, author, title, image, description, tags, stars, forks, links, source, websiteType, websiteName }) {
    this.uid = uid;
    this.object_type = type;
    this.title = title;
    this.website_name = websiteName;
    this.url = url;
    this.image = image;
    this.tags = tags;
    this.stars = stars;
    this.forks = forks;
    this.links = links;
    this.source = source;
    this.website_type = websiteType;
    this.description = description;
    this.author = author;
  }

  toShortVersion () {
    return {
      ...this,
      links: undefined,
      link_count: this.object_type === OBJECT_TYPE.REPOSITORY
        ? this.links.length
        : undefined
    }
  }

}

module.exports = Result;
module.exports.type = OBJECT_TYPE;
