const User = require('../models/user');
const Bookmark = require('../models/bookmark');
const repo = require('../repositories/user');
const websiteService = require('../services/website');

async function registerUser (username, email) {
  let user;
  try {
    user = await repo.getByEmail(email);
  } catch (e) {
    if (e.message !== 'User not found') {
      throw new Error('Unexpected error');
    }
  }
  if (user) {
    throw new Error('User exists');
  } else {
    user = new User(username, email);
  }
  return await repo.saveUser(user);
}

async function updateUser (uid, username, email = null) {
  let user = await repo.getUser(uid);
  user.username = username;
  if (email) {
    user.email = email;
  }
  return await repo.saveUser(user);
}

async function removeUser (uid) {
  await repo.removeUser(uid);
}

async function addBookmark (userUid, title, description, url) {
  const existing = await repo.getBookmarks(userUid, url);
  if (existing.length > 0) {
    throw new Error('Bookmark url already exists');
  }
  const bookmark = new Bookmark(userUid, title, description, url);
  await repo.saveBookmark(bookmark);
  const website = await websiteService.scrapeUrl(bookmark.url);
  return { bookmark, website };
}

module.exports = {
  registerUser,
  updateUser,
  removeUser,
  addBookmark
};
