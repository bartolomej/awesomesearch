let awesome = {};

async function saveAwesome (object) {
  awesome[object.uid] = object;
  return awesome[object.uid];
}

async function getAwesome (uid) {
  const object = awesome[uid];
  if (object) {
    return object;
  } else {
    throw new Error('Entity not found');
  }
}

async function getMatched (regex) {
  const results = [];
  const keys = Object.keys(awesome);
  for (const k of keys) {
    const o = awesome[k];
    const rgx = new RegExp(regex);
    if (
      rgx.test(o.url) ||
      rgx.test(o.description) ||
      (
        o.topics &&
        o.topics.length > 0 &&
        o.topics.map(e => rgx.test(e)).reduce((p, c) => p || c)
      )
    ) {
      results.push(o);
    }
  }
  return results;
}

async function getAll (limit = null) {
  const keys = Object.keys(awesome);
  return keys.map(k => awesome[k])
    .slice(0, limit || keys.length - 1);
}

async function removeAll () {
  awesome = {};
}

module.exports = {
  saveAwesome,
  getAwesome,
  removeAll,
  getMatched,
  getAll
};
