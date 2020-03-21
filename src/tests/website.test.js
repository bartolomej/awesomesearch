const Website = require('../models/website');
const service = require('../services/website');
const repo = require('../repositories/website');
const { readFile } = require('./utils');
const fetchMock = require('fetch-mock');


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
    const website1 = await repo.saveWebsite(getExampleWebsite());
    const website2 = await repo.saveWebsite(getExampleWebsite());
    const fetched = await repo.getMatchedWebsites(/te/);

    expect(fetched.length).toBe(2);
  });

});


describe('Website metadata parsing tests', function () {

  it('should parse node-js.html file', async function () {
    const html = await readFile('./data/node-js.html');
    const metadata = Website.extractMetadata(html);
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

  it('should parse react-native.html file', async function () {
    const html = await readFile('./data/react-native.html');
    const metadata = Website.extractMetadata(html);
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

  it('should parse carbon-github.html file', async function () {
    const html = await readFile('./data/carbon-github.html');
    const metadata = Website.extractMetadata(html);
    expect(metadata).toEqual({
      author: null,
      name: 'GitHub',
      type: 'object',
      url: 'https://github.com/carbon-app/carbon',
      title: 'carbon-app/carbon',
      image: 'https://repository-images.githubusercontent.com/94498635/cb156000-7d42-11e9-8e99-4dcd0e123b28',
      keywords: [],
      description: '🎨 Create and share beautiful images of your source code - carbon-app/carbon',
    })
  });

});


describe('Website service tests', function () {

  beforeEach(fetchMock.reset);

  it('should scrape website given url', async function () {
    fetchMock.get(
      'https://reactnative.dev',
      readFile('./data/react-native.html')
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

  it('should scrape 1 website and return 1 error given array of urls', async function () {
    fetchMock.get(
      'https://some-website-1.com', {
        throws: new Error('request to https://some-website.com failed, reason: getaddrinfo ENOTFOUND some-website.com')
      }
    );
    fetchMock.get(
      'https://some-website-2.com',
      readFile('./data/react-native.html')
    );

    const websites = await service.scrapeUrls(['https://some-website-1.com', 'https://some-website-2.com']);
    expect(websites).toEqual([new Error('Website not found'),  expect.any(Object)])
  });

});
