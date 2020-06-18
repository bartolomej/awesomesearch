const fetch = require('node-fetch');
const Repository = require('../models/repository');
const logger = require('../logger')('github-service');
const { execute } = require('../utils');
const env = require('../env');

const API_HOST = 'https://api.github.com';

async function getRepository (url, fetchReadme = false) {
  const repository = new Repository(url);
  const user = repository.user;
  const repo = repository.name;

  const calls = [
    getRepositoryTopics(user, repo).catch(onGithubError),
    getRepositoryInfo(user, repo).catch(onGithubError),
  ];

  if (fetchReadme) {
    calls.push(getReadme(user, repo).catch(onGithubError))
  }

  const [topics, info, readme] = await execute(`GitHub API call to ${repo}/${user}`, calls);

  function onGithubError (e) {
    logger.error(`Error fetching ${repo}/${user} from Github API: ${e.message}`);
    throw e;
  }

  repository.topics = topics;
  repository.avatar = info.avatar;
  repository.description = info.description;
  repository.stars = info.stars;
  repository.forks = info.forks;
  if (fetchReadme) {
    repository.readme = readme;
  }

  return repository;
}

async function getRepositoryInfo (repo, user) {
  const url = `${API_HOST}/repos/${repo}/${user}`;
  const response = await request('GET', url);
  return {
    avatar: response.owner.avatar_url,
    description: response.description,
    homepage: response.homepage,
    stars: response.stargazers_count,
    forks: response.forks
  }
}

// https://developer.github.com/v3/repos/#get-all-repository-topics
async function getRepositoryTopics (user, repo) {
  const url = `${API_HOST}/repos/${user}/${repo}/topics`;
  const response = await request('GET', url, 'preview');
  return response.names;
}

// TODO: get contribution data via GraphQL api
// https://github.community/t5/GitHub-API-Development-and/Get-contributor-count-with-the-graphql-api/td-p/18593

async function getReadme (user, repo) {
  const url = `${API_HOST}/repos/${user}/${repo}/readme`;
  return await request('GET', url, 'raw');
}

async function rateLimit () {
  const url = `${API_HOST}/rate_limit`;
  return await request('GET', url);
}

async function request (method = 'GET', url, type = 'json', body = undefined) {
  const headers = new fetch.Headers();
  // authorize request to enable 5000 requests/hour rate limit
  headers.set('Authorization', 'Basic ' +
    Buffer.from(env.GH_USERNAME + ":" + env.GH_TOKEN).toString('base64')
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

module.exports = {
  getReadme,
  getRepositoryInfo,
  getRepositoryTopics,
  getRepository,
  rateLimit
};
