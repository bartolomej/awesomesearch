require("reflect-metadata");
const { createConnection, getConnectionManager } = require("typeorm");
const Link = require("./entity/link");
const List = require("./entity/list");
const Repository = require("./entity/repository");
const Website = require("./entity/website");
const SearchLog = require("./entity/searchlog");
const env = require('../env');


async function create (name = "default") {
  const connectionManager = getConnectionManager();
  if (connectionManager.has(name)) {
    return connectionManager.get(name);
  }
  return await createConnection({
    name,
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
    // migrationsRun: true, // autorun migrations
    logging: false,
    // https://github.com/typeorm/typeorm/issues/390
    cli: {
      migrationsDir: 'repos/migration'
    },
    migrations: ["repos/migration/*.js"],
    extra: {
      charset: "utf8mb4_unicode_ci"
    }
  });
}

async function close (name = "default") {
  const connectionManager = getConnectionManager();
  if (connectionManager.has(name)) {
    await connectionManager.get(name).close();
  }
}

module.exports = {
  create,
  close
}
