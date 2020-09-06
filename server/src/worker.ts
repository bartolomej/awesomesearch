import logger from "./logger";
import MetaService from "./services/metadata";
import ImageService from "./services/image";
import ListService from "./services/list";
import GithubService from "./services/github";
import { createQueue } from "./queue";
import throng from 'throng';
import { workerEnv } from "./env";
import { execute } from "./utils";


const env = workerEnv();
const listQueue = createQueue('list');
const linkQueue = createQueue('link');
const log = logger('worker');

function start () {

  const imageService = ImageService({
    cloudinaryCloudName: env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: env.CLOUDINARY_API_SECRET
  });

  const githubService = GithubService({
    githubUsername: env.GH_USERNAME,
    accessToken: env.GH_TOKEN
  });

  const listService = ListService({ githubService });

  const linkService = MetaService({
    imageService,
    githubService
  });

  /**
   * Process awesome repository scraping jobs.
   */
  listQueue.process(async (job, done) => {
    const result = await execute(
      `Processing list: ${job.data.url}`,
      listService.getListData(job.data.url)
    );
    done(null, result);
  });

  /**
   * Process website scraping jobs.
   */
  linkQueue.process(async (job, done) => {
    const result = await execute(
      `Processing link: ${job.data.source}`,
      linkService.getLinkWithMetadata(job.data.url, job.data.source)
    );
    done(null, result);
  });

  log.info(`Worker ${process.pid} started 🙌`);
}

throng(({ workers: env.WORKER_CONCURRENCY, start }));

// handle critical uncaught errors

process.on('unhandledRejection', (reason, promise) => {
  log.error('Uncaught promise rejection: ' + reason);
});

process.on('uncaughtException', (err, origin) => {
  log.error('Uncaught exception' + err + origin);
});
