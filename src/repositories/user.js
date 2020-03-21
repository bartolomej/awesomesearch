let users = {};
let bookmarks = {};


async function saveUser (object) {
  users[object.uid] = object;
  return users[object.uid];
}

async function removeUser (uid) {
  users[uid] = null;
}

async function getAllUsers () {
  const keys = Object.keys(users);
  return keys.map(k => users[k]);
}

async function getUser (uid) {
  const object = users[uid];
  if (object) {
    return object;
  } else {
    throw new Error('User not found');
  }
}

async function getByEmail (email) {
  const keys = Object.keys(users);
  for (let k of keys) {
    if (users[k].email === email) {
      return users[k];
    }
  }
  throw new Error('User not found');
}

async function removeAllUsers () {
  users = {};
}

async function saveBookmark (bookmark) {
  bookmarks[bookmark.uid] = bookmark;
  return bookmarks[bookmark.uid];
}

async function getBookmarks (userUid, url = null) {
  let results = [];
  const keys = Object.keys(bookmarks);
  for (const k of keys) {
    const matchesUser = bookmarks[k].user === userUid;
    if (matchesUser && !url) {
      results.push(bookmarks[k]);
    }
    else if (matchesUser && new RegExp(url).test(bookmarks[k].url)) {
      results.push(bookmarks[k]);
    }
  }
  return results;
}


module.exports = {
  saveUser,
  getUser,
  getAllUsers,
  getByEmail,
  removeUser,
  removeAllUsers,
  saveBookmark,
  getBookmarks
};
