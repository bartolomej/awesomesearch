const awesomeService = require('../services/awesome');
const repo = require('../web/repository');
const Awesome = require('../models/awesome');

describe('Awesome repository tests', function () {

  beforeEach(async () => await repo.removeAllAwesome());

  it('should minify awesome object', function () {
    const a = new Awesome('https://github.com/amnashanwar/awesome-portfolios');
    const constructed = Awesome.fromJson(JSON.stringify(a.minify()));
    expect(a.minify()).toEqual({
      url: 'https://github.com/amnashanwar/awesome-portfolios'
    });
    expect(constructed instanceof Awesome).toBeTruthy();
    expect(constructed.url).toEqual('https://github.com/amnashanwar/awesome-portfolios');
  });

  it('should save object to repo given awesome object', async function () {
    const awesome = new Awesome('https://github.com/amnashanwar/awesome-portfolios');
    awesome.urls = [
      'https://example-2.com',
      'https://example-3.com',
    ];
    repo.saveAwesome(awesome);
    const all = repo.getAllAwesome();
    const saved = repo.getAwesome('amnashanwar/awesome-portfolios');
    expect(saved.uid).toEqual('amnashanwar/awesome-portfolios');
    expect(saved).toEqual(awesome);
    expect(all.length).toBe(1);
  });

  it('should initialize class from json', function () {
    const json = JSON.stringify({
      url: 'https://github.com/amnashanwar/awesome-portfolios',
    });
    const awesome = Awesome.fromJson(json);
    expect(awesome.uid).toEqual('amnashanwar/awesome-portfolios');
  });

  it('should verify that object does not exist in db', function () {
    repo.saveAwesome(new Awesome('https://github.com/amnashanwar/awesome-portfolios'));
    expect(repo.exists('someUid')).toBeFalsy();
    expect(repo.exists('amnashanwar/awesome-portfolios')).toBeTruthy();
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
    expect(awesome.url).toEqual('https://github.com/jthegedus/awesome-firebase/#readme');
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
    const readme = require('./data/mock-data').awesomeNodejsMarkdown;
    const links = awesomeService.parseReadme(readme);
    expect(links).toEqual([
      "https://reactnative.dev",
      "https://reactjs.org",
      "https://flutter.dev",
      "https://kotlinlang.org",
    ]);
  });

});
