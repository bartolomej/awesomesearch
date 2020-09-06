const unified = require('unified');
const markdown = require('remark-parse');
const normalizeUrl = require('normalize-url');
import { selectAll } from "unist-util-select";
import logger from "../logger";
import List from "../models/list";
import { GithubServiceInt } from "./github";

export interface ListServiceInt {
  getListData (url: string): Promise<List>;

  parseReadme (text: string, isRoot?: boolean): Array<String>;
}

interface ListServiceProps {
  githubService?: GithubServiceInt;
}

export default function ListService ({
  githubService
}: ListServiceProps): ListServiceInt {

  const log = logger('list-service');

  async function getListData (url: string): Promise<List> {

    // fetch repo info via GitHub API
    const repository = await githubService.getRepository(url, true);

    // scrape website urls found in readme
    const urls = parseReadme(repository.readme, false);
    log.info(`Found ${urls.length} urls repo:${repository.user}/${repository.name}`);

    return new List(url, repository, urls);
  }

  function parseReadme (text: string, isRoot?: boolean): Array<string> {
    const tree = unified().use(markdown).parse(text);
    let urls = [];
    const links = selectAll('link', tree);
    for (let link of links) {
      if (List.isValidUrl(link.url, isRoot || false)) {
        try {
          // @ts-ignore
          urls.push(normalizeUrl(link.url));
        } catch (e) {
          log.info(`Error normalizing url ${link.url}: ${e.message}`);
        }
      }
    }
    return urls;
  }

  return {
    getListData,
    parseReadme
  };

}
