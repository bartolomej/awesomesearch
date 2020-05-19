const Link = require('../models/link');
const service = require('../services/metadata');
const fetchMock = require('fetch-mock');
const data = require('./data/mock-data');
const repo = require('../web/repository');


describe('Website repository tests', function () {

  beforeEach(async () => await repo.removeAllWebsites());

  it('should minify website object', function () {
    const website = new Link('https://example.com', 'user.repo');
    const constructed = Link.fromJson(JSON.stringify(website.minify()));
    expect(website.minify()).toEqual({
      url: 'https://example.com',
      uid: "example.com",
      source: 'user.repo'
    });
    expect(constructed instanceof Link).toBeTruthy();
    expect(constructed.url).toEqual('https://example.com');
    expect(constructed.source).toEqual('user.repo');
  });

  it('should initialize website from object', function () {
    const obj = JSON.stringify({
      "url": "https://google.com",
      "title": "Google",
      "image": "https://google.com/favicon.ico",
    });
    const website = Link.fromJson(obj);
    expect(website instanceof Link).toBeTruthy();
  });

  it('should save website given website object', async function () {
    const website = new Link('https://example.com');
    website.title = 'Title';
    website.keywords = ['tech', 'money', 'example'];
    website.image = 'https://example-image.com';
    website.description = 'Some description ...';
    website.updated = new Date();
    const saved = await repo.saveWebsite(website);
    expect(saved).toEqual(saved);
  });

});


describe('Website metadata parsing tests', function () {

  it('should parse flutter website html', async function () {
    const metadata = await service.getMetadata(data.flutterHtml, 'https://flutter.dev/');
    expect(metadata).toEqual({
      author: null,
      description: "Flutter is Google's UI toolkit for crafting beautiful, natively compiled applications for mobile, web, and desktop from a single codebase.  Flutter works with existing code, is used by developers and organizations around the world, and is free and open source.",
      image: "https://flutter.dev/images/flutter-logo-sharing.png",
      keywords: [],
      name: null,
      title: "Flutter - Beautiful native apps in record time",
      type: null,
      url: "https://flutter.dev"
    })
  });

  it('should parse node-js website html', async function () {
    const metadata = await service.getMetadata(data.nodejsHtml);
    expect(metadata).toEqual({
      author: null,
      name: null,
      type: 'website',
      url: 'https://glitch.com',
      title: 'Glitch',
      image: 'https://glitch.com/edit/images/logos/glitch/social-card@2x.png',
      keywords: ['developer', 'javascript', 'nodejs', 'editor', 'ide', 'development', 'online', 'web', 'code editor', 'html', 'css'],
      description: 'Combining automated deployment, instant hosting & collaborative editing, Glitch gets you straight to coding so you can build full-stack web apps, fast',
    })
  });

  it('should parse react-native website html', async function () {
    const metadata = await service.getMetadata(data.reactNativeHtml);
    expect(metadata).toEqual({
      author: null,
      name: null,
      type: 'website',
      url: 'https://reactnative.dev',
      title: 'React Native · A framework for building native apps using React',
      image: 'https://reactnative.dev/img/favicon.ico',
      keywords: [],
      description: 'A framework for building native apps using React',
    })
  });

});


describe('Website service tests', function () {

  beforeEach(fetchMock.reset);

  it('should scrape website given url', async function () {
    fetchMock.get(
      'https://reactnative.dev',
      data.reactNativeHtml
    );

    const html = await service.getHtml('https://reactnative.dev/');
    const website = await service.getMetadata(html);

    expect(website).toEqual({
      author: null,
      name: null,
      type: 'website',
      url: 'https://reactnative.dev',
      title: 'React Native · A framework for building native apps using React',
      image: 'https://reactnative.dev/img/logo-og.png',
      keywords: [],
      description: 'A framework for building native apps using React',
    });
  });

  it('should throw error given invalid url', async function () {
    fetchMock.get(
      'https://some-website-1.com', {
        throws: new Error('request to https://some-website.com failed, reason: getaddrinfo ENOTFOUND some-website.com')
      }
    );

    try {
      await service.getHtml('https://some-website-1.com');
      expect(1).toBe(2);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
  });

});


describe('Link model tests', function () {

  it('should compute uid given url: case 1', function () {
    const uid = Link.computeUid('https://reactnative.dev/subpage');
    expect(uid).toEqual('reactnative.dev.subpage');
  });

  it('should compute uid given url: case 2', function () {
    const uid = Link.computeUid('http://www.github.com/bartolomej/cool-links/#readme');
    expect(uid).toEqual('github.com.bartolomej.cool-links');
  });

})
