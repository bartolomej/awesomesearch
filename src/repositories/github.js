let awesome = {};
let links = {};
let websites = {};

async function saveAwesome (object) {
  awesome[object.uid] = object;
}

async function getAwesome (uid) {
  const object = awesome[uid];
  if (object) {
    return object;
  } else {
    throw new Error('Awesome not found');
  }
}

async function saveLink (link) {
  links[link.url] = link;
}

async function getLink (link) {
  const object = links[link.url];
  if (object) {
    return object;
  } else {
    throw new Error('Link not found');
  }
}

async function saveWebsite (website) {
  websites[website.url] = website;
}

async function getWebsite (uid) {
  const object = websites[uid];
  if (object) {
    return object;
  } else {
    throw new Error('Website not found');
  }
}

module.exports = {
  saveAwesome,
  getAwesome,
  saveWebsite,
  getWebsite,
  saveLink,
  getLink
};
