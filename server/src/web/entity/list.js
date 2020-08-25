const { EntitySchema } = require("typeorm");
const List = require('../../models/list');

module.exports = new EntitySchema({
  name: "List",
  target: List,
  columns: {
    uid: {
      primary: true,
      type: "varchar",
    },
    url: {
      type: "varchar"
    }
  },
  relations: {
    repository: {
      target: "Repository",
      type: "one-to-one",
      joinColumn: true,
      joinTable: true
    }
  }
});
