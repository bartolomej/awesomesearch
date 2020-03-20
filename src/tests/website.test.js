const Website = require('../models/website');
const { readFile } = require('./utils');

describe('Website model tests', function () {

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
