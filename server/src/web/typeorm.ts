import "reflect-metadata";
import { Connection, createConnection, getConnectionManager } from "typeorm";
import Link from "./entity/link";
import List from "./entity/list";
import Repository from "./entity/repository";
import Website from "./entity/website";
import SearchLog from "./entity/searchlog";


export async function create (name = "default"): Promise<Connection> {
  const connectionManager = getConnectionManager();
  if (connectionManager.has(name)) {
    return connectionManager.get(name);
  }
  // @ts-ignore
  return await createConnection({
    name,
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
      charset: "utf8mb4_unicode_ci",
    }
  });
}

export async function close (name = "default") {
  const connectionManager = getConnectionManager();
  if (connectionManager.has(name)) {
    await connectionManager.get(name).close();
  }
}
