const User = require('../models/user');
const service = require('../services/user');
const repo = require('../repositories/user');
const fetchMock = require('fetch-mock');
const data = require('./mock-data');

const email = 'joe.doe@gmail.com';
const username = 'joe';


describe('User repository tests', function () {

  beforeEach(async () => await repo.removeAllUsers());

  it('should save and fetch user given user object', async function () {
    const user = new User(username, email);
    const saved = await repo.saveUser(user);
    const fetched = await repo.getUser(user.uid);

    expect(user).toEqual(saved);
    expect(fetched).toEqual(saved);
  });

  it('should update saved user given user object', async function () {
    const user = new User(username, email);
    const saved = await repo.saveUser(user);

    user.username = 'otherUsername';
    user.email = 'other.mail@gmail.com';
    const updated = await repo.saveUser(user);

    expect(updated).toEqual(user);
  });

  it('should reject fetch given that user doesnt exist',async  function () {
    try {
      await repo.getUser('1235');
      expect(1).toBe(2);
    } catch (e) {
      expect(e.message).toEqual('User not found');
    }
  });

});


describe('User service tests', function () {

  beforeEach(async () => {
    await repo.removeAllUsers();
    fetchMock.reset();
  });

  it('should register user given email and username', async function () {
    const user = await service.registerUser(username, email);

    expect(user).toEqual({
      uid: expect.any(String),
      created: expect.any(Date),
      username,
      email,
    })
  });

  it('should update user given new email or username', async function () {
    const user = await service.registerUser(username, email);
    const updated = await service.updateUser(user.uid, 'newUsername');
    expect(updated).toEqual({ ...user, username: 'newUsername' });
  });

  it('should register existing user', async function () {
    await repo.saveUser(new User(username, email));

    try {
      await service.registerUser(username, email);
      expect(1).toBe(2);
    } catch (e) {
      expect(e.message).toEqual('User exists');
    }
  });

  it('should reject bookmark given invalid website url', async function () {
    fetchMock.get(
      'https://invalid-website.com', {
        throws: new Error('request to https://invalid-website.com failed, reason: getaddrinfo ENOTFOUND some-website.com')
      }
    );

    const user = await repo.saveUser(new User(username, email));

    const title = 'Some invalid website...';
    const description = 'Some invalid website description...';
    const url = 'https://invalid-website.com';

    try {
      await service.addBookmark(user.uid, title, description, url);
    } catch (e) {
      expect(e.message).toEqual('Website not found');
    }
  });

  it('should save bookmark given valid website url', async function () {
    fetchMock.get(
      'https://invalid-website.com',
      data.reactNativeHtml
    );

    const user = await repo.saveUser(new User(username, email));

    const title = 'Some invalid website...';
    const description = 'Some invalid website description...';
    const url = 'https://invalid-website.com';

    const bookmark = await service.addBookmark(user.uid, title, description, url);
    expect(bookmark).toEqual({
      bookmark: { uid: expect.any(String), title, url, description, user: user.uid },
      website: {
        uid: expect.any(String),
        author: null,
        name: null,
        type: 'website',
        url: 'https://reactnative.dev',
        title: 'React Native · A framework for building native apps using React',
        image: 'https://reactnative.dev/img/favicon.ico',
        keywords: [],
        description: 'A framework for building native apps using React',
        updated: expect.any(Date)
      }
    })
  });

  it('should reject bookmark given it already exists', async function () {
    fetchMock.get(
      'https://invalid-website.com',
      data.reactNativeHtml
    );

    const user = await repo.saveUser(new User(username, email));

    const title = 'Some invalid website...';
    const description = 'Some invalid website description...';
    const url = 'https://invalid-website.com';

    await service.addBookmark(user.uid, title, description, url);
    try {
      await service.addBookmark(user.uid, title, description, url);
      expect(1).toBe(2);
    } catch (e) {
      expect(e.message).toEqual('Bookmark url already exists');
    }

  });

});
