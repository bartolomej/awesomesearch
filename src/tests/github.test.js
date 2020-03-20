const service = require('../services/github');
const repo = require('../repositories/github');
require('node-fetch');
const fetchMock = require('fetch-mock');
const { readFile } = require('./utils');

describe('GitHub service tests', function () {

  it('should scrape awesome root', async function () {
    fetchMock.get(
      'https://api.github.com/repos/sindresorhus/awesome/contents/readme',
      async () => await readFile('./data/awesome-root.md')
    );
    fetchMock.get(
      'https://api.github.com/repos/sindresorhus/awesome-nodejs/contents/readme',
      async () => await readFile('./data/awesome-nodejs.md')
    );
    fetchMock.get(
      'https://github.com/sindresorhus/awesome-nodejs#readme',
      async () => await readFile('./data/node-js.html')
    );
    fetchMock.get(
      'https://reactnative.dev',
      async () => await readFile('./data/react-native.html')
    );

    await service.scrapeAwesomeRoot();

    const awesomeNodeJs = await repo.getAwesome('sindresorhus/awesome-nodejs');
    expect(awesomeNodeJs).toMatchObject({
      url: 'https://github.com/sindresorhus/awesome-nodejs#readme', // TODO: normalize urls
      uid: 'sindresorhus/awesome-nodejs',
      links: [{
        url: 'https://reactnative.dev',
        created: expect.any(Date)
      }],
      website: {
        author: null,
        name: null,
        type: 'website',
        url: 'https://glitch.com',
        title: 'Glitch',
        image: 'https://glitch.com/edit/images/logos/glitch/social-card@2x.png',
        keywords: ['developer', 'javascript', 'nodejs', 'editor', 'ide', 'development', 'online', 'web', 'code editor', 'html', 'css'],
        description: 'Combining automated deployment, instant hosting & collaborative editing, Glitch gets you straight to coding so you can build full-stack web apps, fast',
      }
    });

    const reactNativeWebsite = await repo.getWebsite('https://reactnative.dev/'); // TODO: generate uuid for website object
    expect(reactNativeWebsite).toEqual({
      author: null,
      name: null,
      type: 'website',
      url: 'https://reactnative.dev/',
      title: 'React Native · A framework for building native apps using React',
      image: 'https://reactnative.dev/img/favicon.ico',
      keywords: [],
      description: 'A framework for building native apps using React',
      updatedDate: expect.any(Date)
    });
  });

});
