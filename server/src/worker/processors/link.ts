import { execute } from "../../utils";
import ImageService from "../../services/image";
import GithubService from "../../services/github";
import MetaService from "../../services/metadata";

const imageService = ImageService({
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET
});

const githubService = GithubService({
  githubUsername: process.env.GH_USERNAME,
  accessToken: process.env.GH_TOKEN
});

const linkService = MetaService({
  imageService,
  githubService
});

export default async function (job) {
  return await execute(
    `Processing link: ${job.data.source}`,
    linkService.getLinkWithMetadata(job.data.url, job.data.source)
  );
}
