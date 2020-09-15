import LinkRepository from "../repos/link";
import ListRepository from "../repos/list";
import SearchLogRepository from "../repos/searchlog";
import { webEnv } from "../env";
import OpenRoutes from "./routes/open";
import AdminRoutes from "./routes/admin";
import WebService from "./service";
import MetaService from "../services/metadata";
import GithubService from "../services/github";
import Server from "./server";
import * as typeorm from '../typeorm';
import logger from "../logger";
import { createQueue } from '../queue';
import ListService from "../services/list";
import { execute } from "../utils";

const throng = require('throng');
const { setQueues } = require('bull-board')


const env = webEnv();
const log = logger('web-index');

async function start () {
  const linkRepository = LinkRepository();
  const listRepository = ListRepository();
  const searchLogRepository = SearchLogRepository();
  const githubService = GithubService({
    githubUsername: env.GH_USERNAME,
    accessToken: env.GH_TOKEN
  });
  const listService = ListService({
    githubService
  })
  const metaService = MetaService({});
  const listQueue = createQueue('list');
  const linkQueue = createQueue('link');

  try {
    const con = await typeorm.create({
      database: env.DB_NAME,
      username: env.DB_USERNAME,
      password: env.DB_PASSWORD,
      host: env.DB_HOST
    });
    log.debug(`Connected to database: ${con.name}`)
  } catch (e) {
    log.error(`Error while connecting to db: ${e}`);
    process.exit(1);
  }

  // inject required dependencies
  const webService = WebService({
    listRepository,
    linkRepository,
    listQueue,
    linkQueue,
    listService,
    githubService,
    searchLogRepository
  });

  // pass queues to 3rd party bull dashboard module
  setQueues([linkQueue, listQueue]);

  try {
    /**
     * Initialise server with injected routes.
     */
    await Server([
      OpenRoutes({
        webService,
        metaService,
        linkRepository,
        listRepository,
        searchLogRepository
      }),
      AdminRoutes({
        webService,
        searchLogRepository,
        githubService
      })
    ]);
    log.info(`Web process ${process.pid} started 🙌`);
  } catch (e) {
    log.error(`Web process encountered an error 🤕 \n${e.stack}`);
  }

  // build index with stored objects if using persistent db
  try {
    // async index build at 200 per data batch
    await execute(`Building keyword search index`, webService.buildSuggestionIndex(200));
  } catch (e) {
    log.error(`Error while building search index: ${e}: ${e.description}`);
  }
}

throng({
  workers: env.WEB_CONCURRENCY,
  lifetime: Infinity
}, start);


// handle critical uncaught errors

process.on('unhandledRejection', (reason, promise) => {
  log.error(`Uncaught promise rejection: ${reason}: ${JSON.stringify(promise)}`);
});

process.on('uncaughtException', (err, origin) => {
  log.error(`Uncaught exception: ${err}: ${origin}`);
});

process.on("SIGTERM", function () {
  // TODO: SIGTERM used by docker - handle it!
  process.exit();
});
