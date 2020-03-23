const service = require('../services/awesome');
const githubRepo = require('../repositories/awesome');
const websiteRepo = require('../repositories/website');
const Awesome = require('../models/awesome');
const fetchMock = require('fetch-mock');
const data = require('./mock-data');

describe('Awesome repository tests', function () {

  beforeEach(async () => await githubRepo.removeAll());

  it('should save object to repo given awesome object', async function () {
    const awesome = new Awesome('https://example.com');
    awesome.urls = [
      'https://example-2.com',
      'https://example-3.com',
    ];
    const saved = await githubRepo.saveAwesome(awesome);
    expect(saved).toEqual(awesome);
  });

});

describe('Awesome service tests', function () {

  beforeEach(async () => {
    fetchMock.reset();
    await githubRepo.removeAll();
    await websiteRepo.removeAll();
  });

  it('should scrape awesome root', async function () {
    fetchMock.get(
      'https://api.github.com/repos/sindresorhus/awesome/readme',
      data.awesomeRootMarkdown
    );
    fetchMock.get(
      'https://api.github.com/repos/sindresorhus/awesome-nodejs',
      data.nodeJsInfo
    );
    fetchMock.get(
      'https://api.github.com/repos/sindresorhus/awesome-nodejs/topics',
      data.nodeJsTopics
    );
    fetchMock.get(
      'https://api.github.com/repos/sindresorhus/awesome-nodejs/readme',
      data.awesomeNodejsMarkdown
    );
    fetchMock.get(
      'https://github.com/sindresorhus/awesome-nodejs#readme',
      data.nodejsHtml
    );
    fetchMock.get(
      'https://reactnative.dev',
      data.reactNativeHtml
    );
    fetchMock.mock('*', 404);

    const response = await service.scrapeAwesomeRoot();
    expect(response).toEqual([
      [
        expect.any(Object),
        expect.any(Error),
        expect.any(Error),
        expect.any(Error),
      ]
    ]);

    const awesomeNodeJs = await githubRepo.getAwesome('sindresorhus/awesome-nodejs');
    expect(awesomeNodeJs).toEqual({
      url: 'https://github.com/sindresorhus/awesome-nodejs#readme',
      uid: 'sindresorhus/awesome-nodejs',
      description: ":zap: Delightful Node.js packages and resources",
      avatar: "https://avatars1.githubusercontent.com/u/170270?v=4",
      forks: 4281,
      homepage: "https://node.cool",
      stars: 34961,
      topics: [
        "awesome-list",
        "nodejs",
      ],
      urls: [
        'https://reactnative.dev',
        "https://reactjs.org",
        "https://flutter.dev",
        "https://kotlinlang.org",
      ],
    });

    const reactNativeWebsite = await websiteRepo.getWebsiteByUrl('https://reactnative.dev'); // TODO: generate uuid for website object
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

});

describe('Awesome model tests', function () {

  it('should parse repo url', function () {
    const url = 'https://github.com/jthegedus/awesome-firebase#readme';
    const parsed = Awesome.parseUrl(url);
    expect(parsed).toEqual({
      user: 'jthegedus',
      repo: 'awesome-firebase'
    })
  });

  it('should normalize url on init', function () {
    const awesome = new Awesome('https://github.com/jthegedus/awesome-firebase/#readme');
    expect(awesome.uid).toEqual('jthegedus/awesome-firebase');
    expect(awesome.url).toEqual('https://github.com/jthegedus/awesome-firebase#readme');
  });

  it('should validate url on child awesome repo', function () {
    expect(Awesome.isValidUrl('#http')).not.toBeTruthy();
    expect(Awesome.isValidUrl('https://creativecommons.org/publicdomain/zero/1.0 ', true)).not.toBeTruthy();
    expect(Awesome.isValidUrl('https://creativecommons.org/publicdomain/zero/1.0 ', false)).not.toBeTruthy();
    expect(Awesome.isValidUrl('https://github.com/jthegedus/awesome-firebase/#readme', false)).not.toBeTruthy();
    expect(Awesome.isValidUrl('https://github.com/someuser/firebase/#readme', false)).toBeTruthy();
    expect(Awesome.isValidUrl('https://github.com/jthegedus/awesome-firebase/#readme', true)).toBeTruthy();
  });

  it('should parse awesome-ecmascript-tools', async function () {
    const readme = require('./mock-data').awesomeNodejsMarkdown;
    const links = Awesome.parseReadme(readme);
    expect(links).toEqual([
      "https://reactnative.dev",
      "https://reactjs.org",
      "https://flutter.dev",
      "https://kotlinlang.org",
    ]);
  });

});
