import { ERROR_MSG_NOT_FOUND } from "../constants";

import Link from "../models/link";
import List from "../models/list";
import Website from "../models/website";
import Repository from "../models/repository";

/**
 * Deserializes objects received from db to domain models.
 */

function deserializeLink (link) {
  if (!link) {
    throw new Error(ERROR_MSG_NOT_FOUND)
  }
  // @ts-ignore
  return Object.assign(new Link(), {
    ...link,
    website: deserializeWebsite(link.website),
    repository: deserializeRepo(link.repository),
  });
}

function deserializeWebsite (website) {
  if (!website) {
    return null;
  }
  // @ts-ignore
  return Object.assign(new Website(), {
    ...website,
    keywords: split(website.keywords)
  });
}

function serializeWebsite (website) {
  if (!website) {
    return null;
  }
  // @ts-ignore
  return Object.assign(new Website(), {
    ...website,
    keywords: join(website.keywords)
  })
}

function deserializeList (list) {
  if (!list) {
    throw new Error(ERROR_MSG_NOT_FOUND);
  }
  // @ts-ignore
  return Object.assign(new List(), {
    ...list,
    repository: deserializeRepo(list.repository)
  })
}

function serializeRepo (repo) {
  if (!repo) {
    return null;
  }
  // @ts-ignore
  return Object.assign(new Repository(), {
    ...repo,
    topics: join(repo.topics)
  });
}

function deserializeRepo (repo) {
  if (!repo) {
    return null;
  }
  // @ts-ignore
  return Object.assign(new Repository(), {
    ...repo,
    topics: split(repo.topics)
  });
}

function split (value) {
  if (!value) {
    return [];
  }
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
  serializeWebsite,
  split
}
