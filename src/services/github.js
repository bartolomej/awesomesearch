global.fetch = require('node-fetch');
const Repository = require('../models/repository');
const logger = require('../logger')('github-service');
const { execute } = require('../utils');

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
  const url = `https://api.github.com/repos/${repo}/${user}`;
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
  const url = `https://api.github.com/repos/${user}/${repo}/topics`;
  const response = await request('GET', url, 'preview');
  return response.names;
}

// TODO: get contribution data via GraphQL api
// https://github.community/t5/GitHub-API-Development-and/Get-contributor-count-with-the-graphql-api/td-p/18593

async function getReadme (user, repo) {
  const url = `https://api.github.com/repos/${user}/${repo}/readme`;
  return await request('GET', url, 'raw');
}

async function request (method = 'GET', url, type = 'json', body = undefined) {
  const response = await fetch(url, {
    headers: {
      'Accept': type === 'preview'
        ? 'application/vnd.github.mercy-preview+json'
        : `application/vnd.github.VERSION.${type}`
    },
    method,
    body,
  });
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
  getRepository
};
