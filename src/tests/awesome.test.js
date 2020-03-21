const Awesome = require('../models/awesome');
const { readFile } = require("./utils");

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

  it('should parse awesome-ecmascript-tools', async function () {
    const links = Awesome.parseReadme(await readFile('./data/awesome-parse.md'));
    expect(links).toEqual([
      'https://github.com/babel/babel',
      'https://github.com/google/traceur-compiler',
      'https://github.com/babel/gulp-babel',
      'https://github.com/sindresorhus/awesome-nodejs#readme',
      'https://github.com/bcoe/awesome-cross-platform-nodejs#readme',
    ]);
  });

});
