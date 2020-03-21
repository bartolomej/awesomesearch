global.fetch = require('node-fetch');

async function getRepositoryInfo (id) {
  const url = `https://api.github.com/repos/${id}`;
  return await request('GET', url);
}

// https://developer.github.com/v3/repos/#get-all-repository-topics
async function getRepositoryTopics (id) {
  const url = `https://api.github.com/repos/${id}/topics`;
  return await request('GET', url, 'preview');
}

// https://developer.github.com/v3/repos/contents/
async function getRepositoryContents (id) {
  const url = `https://api.github.com/repos/${id}/contents`;
  return await request('GET', url);
}

async function getReadme (id) {
  const url = `https://api.github.com/repos/${id}/readme`;
  return await request('GET', url, 'raw');
}

async function getRepositoryFile (id, path) {
  const url = `https://api.github.com/repos/${id}/contents/${path}`;
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
  if (type === 'json') {
    return await response.json();
  } else {
    return await response.text();
  }
}

module.exports = {
  getRepositoryContents,
  getRepositoryFile,
  getReadme,
  getRepositoryInfo,
  getRepositoryTopics
};
