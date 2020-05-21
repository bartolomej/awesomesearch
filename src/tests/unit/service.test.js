const { describe, expect, it, beforeEach } = require("@jest/globals");
const MetaService = require('../../services/metadata');
const fetchMock = require('fetch-mock');
const data = require('../data/mock-data');
const listService = require('../../services/list');


describe('Website metadata parsing tests', function () {

  const metaService = MetaService({ imageService: console.log });

  it('should parse node-js website html', async function () {
    const metadata = await metaService.parseHtml(data.nodejsHtml, 'https://glitch.com');
    expect(metadata).toEqual({
      uid: 'glitch.com',
      author: null,
      name: null,
      type: 'website',
      url: 'https://glitch.com',
      title: 'Glitch',
      image: 'https://glitch.com/edit/images/logos/glitch/social-card@2x.png',
      keywords: ['developer', 'javascript', 'nodejs', 'editor', 'ide', 'development', 'online', 'web', 'code editor', 'html', 'css'],
      description: 'Combining automated deployment, instant hosting & collaborative editing, Glitch gets you straight to coding so you can build full-stack web apps, fast',
      screenshot: null,
      screenshotId: null
    })
  });

  it('should parse react-native website html', async function () {
    const metadata = await metaService.parseHtml(data.reactNativeHtml, 'https://reactnative.dev');
    expect(metadata).toEqual({
      uid: 'reactnative.dev',
      author: null,
      name: null,
      type: 'website',
      url: 'https://reactnative.dev',
      title: 'React Native · A framework for building native apps using React',
      image: 'https://reactnative.dev/img/favicon.ico',
      keywords: [],
      description: 'A framework for building native apps using React',
      screenshot: null,
      screenshotId: null
    })
  });

});

describe('Website service tests', function () {

  const metaService = MetaService({ imageService: console.log });

  beforeEach(fetchMock.reset);

  it('should scrape website given url', async function () {
    fetchMock.get(
      'https://reactnative.dev',
      data.reactNativeHtml
    );

    const html = await metaService.getHtml('https://reactnative.dev');
    const website = await metaService.parseHtml(html, 'https://reactnative.dev');

    expect(website).toEqual({
      uid: 'reactnative.dev',
      author: null,
      name: null,
      type: 'website',
      url: 'https://reactnative.dev',
      title: 'React Native · A framework for building native apps using React',
      image: 'https://reactnative.dev/img/logo-og.png',
      keywords: [],
      description: 'A framework for building native apps using React',
      screenshot: null,
      screenshotId: null
    });
  });

  it('should throw error given invalid url', async function () {
    fetchMock.get(
      'https://some-website-1.com', {
        throws: new Error('request to https://some-website.com failed, reason: getaddrinfo ENOTFOUND some-website.com')
      }
    );
    try {
      await metaService.getHtml('https://some-website-1.com');
      expect(1).toBe(2);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
  });

});

describe('List service tests', function () {

  it('should parse awesome-ecmascript-tools', async function () {
    const readme = require('../data/mock-data').awesomeNodejsMarkdown;
    const links = listService.parseReadme(readme);
    expect(links).toEqual([
      "https://reactnative.dev",
      "https://reactjs.org",
      "https://flutter.dev",
      "https://kotlinlang.org",
    ]);
  });

})
