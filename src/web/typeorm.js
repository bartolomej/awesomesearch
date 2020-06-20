require("reflect-metadata");
const { createConnection } = require("typeorm");
const Link = require("./entity/link");
const List = require("./entity/list");
const Repository = require("./entity/repository");
const Website = require("./entity/website");
const SearchLog = require("./entity/searchlog");
const env = require('../env');

let connection;

async function create () {
  connection = await createConnection({
    type: "mysql",
    host: env.DB_HOST,
    port: env.DB_PORT,
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    entities: [
      Link,
      List,
      Repository,
      Website,
      SearchLog
    ],
    synchronize: true,
    logging: false,
    // https://github.com/typeorm/typeorm/issues/390
    extra: {
      charset: "utf8mb4_unicode_ci"
    }
  });
  console.log(`Mysql connection created !`);
}

async function close () {
  if (connection) {
    await connection.close();
    console.log(`Mysql connection closed`);
  }
}

module.exports = {
  create,
  close
}
