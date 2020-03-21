const uuid = require('uuid').v4;

class Bookmark {

  constructor (user, title, description, url) {
    this.uid = uuid();
    this.url = url;
    this.user = user;
    this.title = title;
    this.description = description;
  }

}

module.exports = Bookmark;
