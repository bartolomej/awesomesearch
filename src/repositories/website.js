let websites = {};

async function saveWebsite (website) {
  websites[website.uid] = website;
  return websites[website.uid];
}

async function getWebsite (uid) {
  const object = websites[uid];
  if (object) {
    return object;
  } else {
    throw new Error('Website not found');
  }
}

async function getMatchedWebsites (regex) {
  const results = [];
  const keys = Object.keys(websites);
  for (const k of keys) {
    const o = websites[k];
    const rgx = new RegExp(regex);
    if (
      rgx.test(o.title) ||
      rgx.test(o.description) ||
      rgx.test(o.url) ||
      rgx.test(o.name) ||
      (
        o.keywords &&
        o.keywords.length > 0 &&
        o.keywords.map(e => rgx.test(e)).reduce((p, c) => p || c)
      )
    ) {
      results.push(o);
    }
  }
  return results;
}

async function getWebsiteByUrl (url) {
  const keys = Object.keys(websites);
  for (const k of keys) {
    if (websites[k].url === url) {
      return websites[k];
    }
  }
  throw new Error('Website not found');
}

async function removeAll () {
  websites = {};
}

async function getAll () {
  const keys = Object.keys(websites);
  return keys.map(k => websites[k]);
}

module.exports = {
  saveWebsite,
  getWebsite,
  getWebsiteByUrl,
  removeAll,
  getAll,
  getMatchedWebsites
};
