import { ERROR_MSG_INVALID_REQ } from "../../constants";
import List from "../../models/list";
import Link from "../../models/link";

const emojiMap = require('../public/emojis.json');
const { validationResult } = require('express-validator');

export interface ListResponseInt {
  uid: string;
  object_type: 'list';
  title: string;
  author: string;
  description: string;
  emojis: Array<EmojiResponse>;
  url: string;
  website_name: string;
  image_url: string;
  tags: Array<String>;
  stars: number;
  forks: number;
}

interface LinkResponseInt {
  uid: string;
  object_type: 'link'
  title: string;
  description: string;
  emojis: Array<EmojiResponse>;
  url: string;
  website_name: string;
  website_type: string;
  icon_url: string;
  image_url: string;
  screenshot_url: string;
  tags: Array<String>;
  source: {
    uid: string;
    title: string;
    image_url: string;
  }
}

interface EmojiResponse {
  key: string;
  url: string;
}

interface StatsResponse {
  link_count: number;
  list_count: number;
  search_count: number;
  keywords_index: Object;
}

function validateReqParams (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new Error(ERROR_MSG_INVALID_REQ));
  } else {
    return next();
  }
}

function serializeList (list: List): ListResponseInt {
  return {
    uid: list.uid,
    object_type: 'list',
    title: list.title,
    author: list.author,
    description: list.description,
    emojis: serializeEmojis(list.emojis),
    url: list.url,
    website_name: list.websiteName,
    image_url: list.image,
    tags: list.tags,
    stars: list.stars,
    forks: list.forks,
  }
}

function serializeSearchResult (response) {
  return {
    ...response,
    result: response.result.map(o => (
      o instanceof List ? serializeList(o) : serializeLink(o)
    ))
  }
}


function serializeLink (link: Link): LinkResponseInt {
  return {
    uid: link.uid,
    object_type: 'link',
    title: link.title,
    description: link.description,
    emojis: serializeEmojis(link.emojis),
    url: link.url,
    website_name: link.websiteName,
    website_type: link.websiteType,
    icon_url: link.icon,
    image_url: link.image,
    screenshot_url: link.screenshot,
    tags: link.tags,
    source: serializeSource(link.source)
  }
}

function serializeSource (source) {
  // source could be either list uid of type string
  // or a full embedded object of type List
  if (source instanceof List) {
    return {
      uid: source.uid,
      title: source.title,
      image_url: source.image,
    }
  } else {
    return source;
  }
}

function serializeEmojis (emojis): Array<EmojiResponse> {
  return emojis.map(k => ({
    key: k,
    url: emojiMap[k]
  }))
}

function serializeStats (stats): StatsResponse {
  return {
    link_count: stats.linkCount,
    list_count: stats.listCount,
    search_count: stats.searchCount,
    keywords_index: stats.keywordsIndex
  }
}

module.exports = {
  serializeList,
  serializeLink,
  serializeEmojis,
  serializeSource,
  serializeStats,
  serializeSearchResult,
  validateReqParams
}
