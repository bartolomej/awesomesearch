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
    throw new Error('Awesome not found');
  }
}

async function removeAll () {
  awesome = {};
}

module.exports = {
  saveAwesome,
  getAwesome,
  removeAll
};
