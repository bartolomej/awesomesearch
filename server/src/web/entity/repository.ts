import { EntitySchema } from "typeorm";
import Repository from "../../models/repository";


export default new EntitySchema({
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
      type: "longtext"
    }
  },
  indices: [
    {
      name: 'search',
      fulltext: true,
      synchronize: true,
      columns: [
        'url',
        'homepage',
        'description',
        'topics'
      ]
    }
  ],
  relations: {
    // @ts-ignore
    repository: {
      target: "List",
      type: "one-to-one",
    }
  }
});
