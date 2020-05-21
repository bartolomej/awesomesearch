const { EntitySchema } = require("typeorm");
const Repository = require('../../models/repository');

module.exports = new EntitySchema({
  name: "Repository",
  target: Repository,
  columns: {
    uid: {
      primary: true,
      type: "varchar",
    },
    avatar: {
      type: "varchar",
      nullable: true
    },
    url: {
      type: "varchar"
    },
    homepage: {
      type: "varchar",
      nullable: true
    },
    description: {
      type: "varchar",
      nullable: true
    },
    stars: {
      type: "int"
    },
    forks: {
      type: "int"
    },
    topics: {
      type: "json"
    }
  },
  relations: {
    repository: {
      target: "List",
      type: "one-to-one",
    }
  }
});
