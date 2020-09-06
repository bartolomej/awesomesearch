const fetchMock = require('fetch-mock');
import MetaService, { MetaServiceInt } from "./metadata";


describe('Website metadata parsing tests', function () {

  let metaService: MetaServiceInt = MetaService({});
  beforeEach(fetchMock.reset);

  it('should parse node-js website html', async function () {
    fetchMock.get('https://glitch.com/favicon.ico', { ok: false, status: 200 });
    fetchMock.get('https://glitch.com/edit/images/logos/glitch/social-card@2x.png', {
      ok: true,
      status: 200
    });
    const mockData = `
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <link id="favicon" rel="icon" href="favicon.ico?v=3" type="image/x-icon">
        <link rel="icon" href="https://glitch.com/favicon.ico" />
        <title>server.js – nodejs-dev-0001-01</title>
        <meta name="description"
              content="Combining automated deployment, instant hosting &amp; collaborative editing, Glitch gets you straight to coding so you can build full-stack web apps, fast">
        <meta name="keywords"
              content="developer, javascript, nodejs,  editor, ide , development, online, web, code editor, html, css">
        <meta name="og:type" content="website">
        <meta name="og:url" content="https://glitch.com">
        <meta name="og:title" content="Glitch">
        <meta name="og:description"
              content="Combining automated deployment, instant hosting &amp; collaborative editing, Glitch gets you straight to coding so you can build full-stack web apps, fast">
        <meta name="og:image" content="https://glitch.com/edit/images/logos/glitch/social-card@2x.png">
        <meta name="twitter:card" content="summary">
        <meta name="twitter:site" content="@glitch">
        <meta name="twitter:title" content="Glitch">
        <meta name="twitter:description"
              content="Combining automated deployment, instant hosting &amp; collaborative editing, Glitch gets you straight to coding so you can build full-stack web apps, fast">
        <meta name="twitter:image" content="https://glitch.com/edit/images/logos/glitch/social-card@2x.png">
        <meta name="twitter:image:alt" content="Glitch Logo">
        <meta name="twitter:url" content="https://glitch.com">
    </head>
    </html>
    `;
    const metadata = await metaService.getParsedWebsite(mockData, 'https://glitch.com');
    expect(metadata).toEqual({
      uid: 'glitch.com',
      author: null,
      icon: 'https://glitch.com/favicon.ico?v=3',
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
    const mockData = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <title>React Native · A framework for building native apps using React</title>
        <link rel="icon" href="https://reactnative.dev/favicon.ico" />
        <meta name="description" content="A framework for building native apps using React">
        <meta property="og:title" content="React Native · A framework for building native apps using React">
        <meta property="og:type" content="website">
        <meta property="og:url" content="https://reactnative.dev/">
        <meta property="og:description" content="A framework for building native apps using React">
        <meta name="twitter:card" content="summary">
        <link rel="shortcut icon" href="/img/favicon.ico">
        <link rel="alternate" type="application/atom+xml" href="https://reactnative.dev/blog/atom.xml"
              title="React Native Blog ATOM Feed">
        <link rel="alternate" type="application/rss+xml" href="https://reactnative.dev/blog/feed.xml"
              title="React Native Blog RSS Feed">
    </head>
    </html>
    `;
    const metadata = await metaService.getParsedWebsite(mockData, 'https://reactnative.dev');
    expect(metadata).toEqual({
      uid: 'reactnative.dev',
      author: null,
      icon: 'https://reactnative.dev/favicon.ico',
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

  let metaService;
  beforeEach(() => {
    metaService = MetaService({});
    fetchMock.reset();
  });

  it('should throw error given invalid url', async function () {
    fetchMock.get(
      'https://some-website-1.com', {
        throws: new Error('request to https://some-website.com failed, reason: getaddrinfo ENOTFOUND some-website.com')
      }
    );
    try {
      await metaService.fetchHtml('https://some-website-1.com');
      expect(1).toBe(2);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
  });

});
