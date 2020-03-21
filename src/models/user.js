const uuid = require('uuid').v4;

class User {

  constructor (username, email) {
    this.uid = uuid();
    this.username = username;
    this.email = email;
    this.created = new Date();
  }

}

module.exports = User;
