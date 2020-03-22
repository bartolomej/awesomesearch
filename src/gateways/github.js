global.fetch = require('node-fetch');

async function getRepositoryInfo (id) {
  const url = `https://api.github.com/repos/${id}`;
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
async function getRepositoryTopics (id) {
  const url = `https://api.github.com/repos/${id}/topics`;
  const response = await request('GET', url, 'preview');
  return response.names;
}

// TODO: get contribution data via GraphQL api
// https://github.community/t5/GitHub-API-Development-and/Get-contributor-count-with-the-graphql-api/td-p/18593

async function getReadme (id) {
  const url = `https://api.github.com/repos/${id}/readme`;
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
  getRepositoryTopics
};
