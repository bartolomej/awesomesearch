require("reflect-metadata");
const { createConnection } = require("typeorm");
const Link = require("./entity/link");
const List = require("./entity/list");
const Repository = require("./entity/repository");
const Website = require("./entity/website");

let connection;

async function create () {
  connection = await createConnection({
    type: "mysql",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [
      Link,
      List,
      Repository,
      Website
    ],
    synchronize: true,
    logging: false
  });
}

async function close () {
  if (connection) {
    await connection.close();
  }
}

module.exports = {
  create,
  close
}
