import { ERROR_MSG_INVALID_REQ } from "../../constants";
import List from "../../models/list";
import Link from "../../models/link";

const emojiMap = require('../public/emojis.json');
const { validationResult } = require('express-validator');

export interface EmojiResponse {
  key: string;
  url: string;
}

export interface SearchResultDetails {
  total_results: number;
}

export interface KeywordResultDetails {
  page: number;
  next: number | null;
}

export function validateReqParams (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new Error(ERROR_MSG_INVALID_REQ));
  } else {
    return next();
  }
}

export function serializeSearchResult<T> (
  results: Array<T>,
  details: SearchResultDetails | KeywordResultDetails
) {
  return {
    ...details,
    results
  }
}

export function serializeList (list: List) {
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

export function serializeLink (link: Link, list?: List) {
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
    source: serializeSource(list)
  }
}

function serializeSource (source) {
  return source ? {
    uid: source.uid,
    title: source.title,
    image_url: source.image,
  } : undefined
}

export function serializeEmojis (emojis): Array<EmojiResponse> {
  return emojis.map(k => ({
    key: k,
    url: emojiMap[k]
  }))
}
