const service = require('../web/service');
const awesomeService = require('../services/awesome');
const githubRepo = require('../web/repositories/awesome');
const Awesome = require('../models/awesome');

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

describe('Awesome model tests', function () {

  it('should parse repo url', function () {
    const url = 'https://github.com/jthegedus/awesome-firebase#readme';
    const parsed = Awesome.parseUrl(url);
    expect(parsed).toEqual({
      user: 'jthegedus',
      repo: 'awesome-firebase'
    });
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
    const links = awesomeService.parseReadme(readme);
    expect(links).toEqual([
      "https://reactnative.dev",
      "https://reactjs.org",
      "https://flutter.dev",
      "https://kotlinlang.org",
    ]);
  });

});
