const { EntitySchema } = require("typeorm");
const SearchLog = require('../../models/searchlog');

module.exports = new EntitySchema({
  name: "SearchLog",
  target: SearchLog,
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true
    },
    query: {
      type: "varchar"
    },
    userAgent: {
      type: "varchar"
    },
    datetime: {
      type: "datetime"
    }
  }
});
