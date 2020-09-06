import fetch from 'node-fetch';
import Repository from "../models/repository";
import logger from "../logger";
import { execute } from "../utils";


const API_HOST = 'https://api.github.com';

export interface GithubServiceInt {
  getRepository (url: string, fetchReadme: boolean): Promise<Repository>;

  getRateLimit (): Promise<RateLimitResponse>;

  getReadme (user: string, repo: string): Promise<string>;
}

interface GithubServiceParams {
  githubUsername: string;
  accessToken: string;
}

interface RateLimitResponse {
  resources: {
    core: RateLimitObject;
    graphql: RateLimitObject;
    integration_manifest: RateLimitObject;
    search: RateLimitObject;
  };
  rate: RateLimitObject;
}

interface RateLimitObject {
  limit: number;
  remaining: number;
  reset: number;
}

export default function GithubService ({
  githubUsername,
  accessToken
}: GithubServiceParams): GithubServiceInt {
  const log = logger('github-service');

  async function getRepository (
    url: string,
    fetchReadme: boolean = false
  ): Promise<Repository> {

    const repository = new Repository(url);
    const user = repository.user;
    const repo = repository.name;

    // TODO: get contribution data via GraphQL api
    // https://github.community/t5/GitHub-API-Development-and/Get-contributor-count-with-the-graphql-api/td-p/18593
    const calls = [
      // https://developer.github.com/v3/repos/#get-all-repository-topics
      request('GET', `${API_HOST}/repos/${user}/${repo}/topics`, 'preview')
        .catch(onGithubError),
      request('GET', `${API_HOST}/repos/${user}/${repo}`)
        .catch(onGithubError),
    ];
    if (fetchReadme) {
      calls.push(
        getReadme(user, repo).catch(onGithubError)
      )
    }

    const [topics, info, readme] = await execute(`GitHub API call to ${repo}/${user}`, calls);

    function onGithubError (e) {
      log.error(`Error fetching ${user}/${repo} from Github API: ${e.message}`);
      throw e;
    }

    repository.topics = topics.names;
    repository.avatar = info.owner.avatar_url;
    repository.description = info.description;
    repository.stars = info.stargazers_count;
    repository.forks = info.forks;
    if (fetchReadme) {
      repository.readme = readme;
    }

    return repository;
  }

  async function getReadme (user, repo): Promise<string> {
    return request('GET', `${API_HOST}/repos/${user}/${repo}/readme`, 'raw');
  }

  async function getRateLimit (): Promise<RateLimitResponse> {
    const url = `${API_HOST}/rate_limit`;
    return request('GET', url);
  }

  async function request (method = 'GET', url, type = 'json', body = undefined) {
    const headers = new fetch.Headers();
    // authorize request to enable 5000 requests/hour rate limit
    headers.set('Authorization', 'Basic ' +
      Buffer.from(githubUsername + ":" + accessToken).toString('base64')
    );
    headers.set('Accept', type === 'preview'
      ? 'application/vnd.github.mercy-preview+json'
      : `application/vnd.github.VERSION.${type}`
    )
    const response = await fetch(url, { headers, method, body, });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    if (type !== 'raw') {
      return await response.json();
    } else {
      return await response.text();
    }
  }

  return {
    getRepository,
    getRateLimit,
    getReadme
  };

}
