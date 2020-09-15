import { EntitySchema } from "typeorm";
import Link from "../../models/link";

export default new EntitySchema({
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
    // @ts-ignore
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
