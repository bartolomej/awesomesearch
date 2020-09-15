import List from "../../models/list";
import { EntitySchema } from "typeorm";


export default new EntitySchema({
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
    // @ts-ignore
    repository: {
      target: "Repository",
      type: "one-to-one",
      joinColumn: true,
      joinTable: true
    }
  }
});
