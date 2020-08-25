const { EntitySchema } = require("typeorm");
const Link = require('../../models/link');

module.exports = new EntitySchema({
  name: "Link",
  target: Link,
  columns: {
    uid: {
      primary: true,
      type: "varchar",
    },
    url: {
      type: "varchar",
    },
    source: {
      type: "varchar"
    }
  },
  relations: {
    website: {
      target: "Website",
      type: "one-to-one",
      joinColumn: true,
    },
    repository: {
      target: "Repository",
      type: "one-to-one",
      joinColumn: true,
    }
  }
});
