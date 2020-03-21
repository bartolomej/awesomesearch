const service = require('../services/github');
const githubRepo = require('../repositories/github');
const websiteRepo = require('../repositories/website');
const Awesome = require('../models/awesome');
const fetchMock = require('fetch-mock');
const { readFile } = require('./utils');


describe('Github repository tests', function () {

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


describe('GitHub service tests', function () {

  beforeEach(async () => {
    fetchMock.reset();
    await githubRepo.removeAll();
    await websiteRepo.removeAll();
  });

  it('should scrape awesome root', async function () {
    fetchMock.get(
      'https://api.github.com/repos/sindresorhus/awesome/contents/readme',
      readFile('./data/awesome-root.md')
    );
    fetchMock.get(
      'https://api.github.com/repos/sindresorhus/awesome-nodejs/contents/readme',
      readFile('./data/awesome-nodejs.md')
    );
    fetchMock.get(
      'https://github.com/sindresorhus/awesome-nodejs#readme',
      readFile('./data/node-js.html')
    );
    fetchMock.get(
      'https://reactnative.dev',
      readFile('./data/react-native.html')
    );

    await service.scrapeAwesomeRoot();

    const awesomeNodeJs = await githubRepo.getAwesome('sindresorhus/awesome-nodejs');
    expect(awesomeNodeJs).toMatchObject({
      url: 'https://github.com/sindresorhus/awesome-nodejs#readme',
      uid: 'sindresorhus/awesome-nodejs',
      urls: [
        'https://reactnative.dev'
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
