class AwesomeLink {

  constructor (url) {
    this.url = url;
    this.created = new Date();
    this.normalize();
  }

  normalize () {
    if (this.url[this.url.length - 1] === '/') {
      this.url = this.url.substring(0, this.url.length - 1);
    }
  }

}


module.exports = AwesomeLink;
