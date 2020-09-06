import SearchLog from "../../models/searchlog";
import { EntitySchema } from "typeorm";


export default new EntitySchema({
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
