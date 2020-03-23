const Website = require('../models/website');
const service = require('../services/website');
const repo = require('../repositories/website');
const fetchMock = require('fetch-mock');
const data = require('./mock-data');


describe('Website repository tests', function () {

  beforeEach(async () => await repo.removeAll());

  function getExampleWebsite () {
    const website = new Website('https://example.com');
    website.title = 'Title';
    website.keywords = ['tech', 'money', 'example'];
    website.image = 'https://example-image.com';
    website.description = 'Some description ...';
    website.updated = new Date();
    return website;
  }

  it('should save website given website object', async function () {
    const website = getExampleWebsite();
    const saved = await repo.saveWebsite(website);
    expect(saved).toEqual(saved);
  });

  it('should update website given modified website object', async function () {
    const website = getExampleWebsite();
    const saved = await repo.saveWebsite(website);
    website.title = 'Some title...';
    const updated = await repo.saveWebsite(website);
    expect(updated).toEqual(website);
  });

  it('should fetch website by url given url string', async function () {
    const website = await repo.saveWebsite(getExampleWebsite());
    const fetched = await repo.getWebsiteByUrl('https://example.com');
    expect(fetched).toEqual(website);
  });

  it('should fetch websites by any attribute given regex', async function () {
    await repo.saveWebsite(getExampleWebsite());
    await repo.saveWebsite(getExampleWebsite());
    const fetched = await repo.getMatched(/te/);

    expect(fetched.length).toBe(2);
  });

});


describe('Website metadata parsing tests', function () {

  it('should parse flutter website html', function () {
    const metadata = Website.extractMetadata(data.flutterHtml);
    expect(metadata).toEqual({
      author: null,
      description: "Flutter is Google's UI toolkit for crafting beautiful, natively compiled applications for mobile, web, and desktop from a single codebase.  Flutter works with existing code, is used by developers and organizations around the world, and is free and open source.",
      image: "https://flutter.dev/images/flutter-logo-sharing.png",
      keywords: [],
      name: null,
      title: "Flutter - Beautiful native apps in record time",
      type: null,
      url: "https://flutter.dev/"
    })
  });

  it('should parse node-js website html', async function () {
    const metadata = Website.extractMetadata(data.nodejsHtml);
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
    const metadata = Website.extractMetadata(data.reactNativeHtml);
    expect(metadata).toEqual({
      author: null,
      name: null,
      type: 'website',
      url: 'https://reactnative.dev/',
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

    const website = await service.scrapeUrl('https://reactnative.dev/');

    const reactNativeWebsite = await repo.getWebsiteByUrl('https://reactnative.dev');
    expect(website).toEqual(reactNativeWebsite);
    expect(reactNativeWebsite).toEqual({
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
    });
  });

  it('should throw error given invalid url', async function () {
    fetchMock.get(
      'https://some-website-1.com', {
        throws: new Error('request to https://some-website.com failed, reason: getaddrinfo ENOTFOUND some-website.com')
      }
    );

    try {
      await service.scrapeUrl('https://some-website-1.com');
      expect(1).toBe(2);
    } catch (e) {
      expect(e).toEqual(new Error('Website not found'));
    }
  });

});
