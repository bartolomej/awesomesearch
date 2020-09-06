import GithubService from "../../services/github";
import ListService from "../../services/list";
import { execute } from "../../utils";

const githubService = GithubService({
  githubUsername: process.env.GH_USERNAME,
  accessToken: process.env.GH_TOKEN
});

const listService = ListService({ githubService });

export default async function (job) {
  return await execute(
    `Processing list: ${job.data.url}`,
    listService.getListData(job.data.url)
  );
}
