const typeorm = require('../src/web/typeorm');
const logger = require('../src/logger')('db-seed');
const listRepository = require('../src/web/repos/list');

async function main () {
  await typeorm.create();
  await listRepository.removeAll();
  logger.debug(`Removed all entities from db`);
  process.exit(0);
}

main();
