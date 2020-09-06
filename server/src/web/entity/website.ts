import Website from "../../models/website";
import { EntitySchema } from "typeorm";


export default new EntitySchema({
  name: "Website",
  target: Website,
  columns: {
    uid: {
      primary: true,
      type: "varchar",
    },
    url: {
      type: "varchar",
    },
    title: {
      type: "varchar",
    },
    type: {
      type: "varchar",
      nullable: true
    },
    name: {
      type: "varchar",
      nullable: true,
    },
    description: {
      type: "longtext",
      nullable: true,
    },
    author: {
      type: "varchar",
      nullable: true,
    },
    icon: {
      type: "longtext",
      nullable: true
    },
    image: {
      type: "longtext",
      nullable: true
    },
    screenshot: {
      type: "varchar",
      nullable: true
    },
    screenshotId: {
      type: "varchar",
      nullable: true
    },
    keywords: {
      type: "longtext",
      nullable: true,
    },
  },
  indices: [
    {
      name: 'search',
      fulltext: true,
      synchronize: true,
      columns: [
        'url',
        'title',
        'name',
        'description',
        'author',
        'keywords'
      ]
    }
  ],
});
