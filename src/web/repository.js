let websites = {};
let awesome = {};

function saveAwesome (object) {
  awesome[object.uid] = object;
  return awesome[object.uid];
}

function getAwesomeCount () {
  return Object.keys(awesome).length;
}

function getAwesome (uid) {
  const object = awesome[uid];
  if (object) {
    return object;
  } else {
    throw new Error('Entity not found');
  }
}

function getAllAwesome (limit = null) {
  const keys = Object.keys(awesome);
  return keys.map(k => awesome[k])
    .slice(0, limit || keys.length);
}

function removeAllAwesome () {
  awesome = {};
}

function saveWebsite (website) {
  websites[website.uid] = website;
  return websites[website.uid];
}

function getWebsiteCount () {
  return Object.keys(websites).length;
}

function getWebsite (uid) {
  const object = websites[uid];
  if (object) {
    return object;
  } else {
    throw new Error('Website not found');
  }
}

function randomWebsite () {
  const keys = Object.keys(websites);
  const rand = Math.round(Math.random() * keys.length - 1);
  return websites[keys[rand]];
}

function removeAllWebsites () {
  websites = {};
}

function getAllWebsites (limit = null) {
  const keys = Object.keys(websites);
  return keys.map(k => websites[k])
    .slice(0, limit || keys.length);
}

module.exports = {
  saveWebsite,
  saveAwesome,
  getWebsite,
  getAwesome,
  removeAllWebsites,
  removeAllAwesome,
  getAllAwesome,
  getAllWebsites,
  randomWebsite,
  getWebsiteCount,
  getAwesomeCount
};
