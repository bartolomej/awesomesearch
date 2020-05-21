const Link = require('../../models/link');
const List = require('../../models/list');
const Website = require('../../models/website');
const Repository = require('../../models/repository');

function deserializeLink (link) {
  if (!link) {
    throw new Error('Object not found')
  }
  return Object.assign(new Link(), {
    ...link,
    website: deserializeWebsite(link.website),
    repository: deserializeRepo(link.repository),
  });
}

function deserializeWebsite (website) {
  if (!website) {
    throw new Error('Object not found')
  }
  return Object.assign(new Website(), {
    ...website,
    keywords: split(website.keywords)
  });
}

function serializeWebsite (website) {
  return Object.assign(new Website(), {
    ...website,
    keywords: join(website.keywords)
  })
}

function deserializeList (list) {
  if (!list) {
    throw new Error('Object not found')
  }
  return Object.assign(new List(), {
    ...list,
    repository: deserializeRepo(list.repository)
  })
}

function serializeRepo (repo) {
  if (!repo) {
    return null;
  }
  return Object.assign(new Repository(), {
    ...repo,
    topics: join(repo.topics)
  });
}

function deserializeRepo (repo) {
  if (!repo) {
    return null;
  }
  return Object.assign(new Repository(), {
    ...repo,
    topics: split(repo.topics)
  });
}

function split (value) {
  return value.split(',').filter(e => e !== '')
}

function join (values) {
  return values.join(',');
}

module.exports = {
  deserializeList,
  deserializeRepo,
  deserializeWebsite,
  deserializeLink,
  serializeRepo,
  serializeWebsite
}
