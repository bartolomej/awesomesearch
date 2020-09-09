import * as typeorm from "../web/typeorm";
import { getRepository } from "typeorm";
import logger from "../logger";
import { webEnv } from "../env";

async function main () {
  const log = logger('script:reset-db');
  const env = webEnv();
  await typeorm.create({
    database: env.DB_NAME,
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    host: env.DB_HOST
  });
  await removeAll();
  log.debug(`Removed all entities from db`);
  process.exit(0);
}

async function removeAll () {
  await getRepository('Link').query('DELETE FROM link WHERE 1=1');
  await getRepository('List').query('DELETE FROM list WHERE 1=1');
  await getRepository('Repository').query('DELETE FROM repository WHERE 1=1');
  await getRepository('Website').query('DELETE FROM website WHERE 1=1');
}

main();
