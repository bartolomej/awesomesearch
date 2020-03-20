const Awesome = require('../models/awesome');
const AwesomeLink = require('../models/awesome-link');

describe('Awesome model tests', function () {

  it('should parse repo url', function () {
    const url = 'https://github.com/jthegedus/awesome-firebase#readme';
    const parsed = Awesome.parseUrl(url);
    expect(parsed).toEqual({
      user: 'jthegedus',
      repo: 'awesome-firebase'
    })
  });

  it('should init from url', function () {
    const awesome = new Awesome('https://github.com/jthegedus/awesome-firebase#readme');
    expect(awesome.uid).toEqual('jthegedus/awesome-firebase');
  });

});

describe('AwesomeLink model tests', function () {

  it('should normalize url', function () {
    const parsed = new AwesomeLink('https://reactnative.dev/');
    expect(parsed.url).toEqual('https://reactnative.dev');
  });

});
