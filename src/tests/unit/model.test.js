const Link = require('../../models/link');
const Website = require('../../models/website');
const Repository = require('../../models/repository');
const List = require('../../models/list');


describe('Repository model tests', function () {

  it('should parse repo url', function () {
    const url = 'https://github.com/jthegedus/awesome-firebase#readme';
    const parsed = Repository.parseUrl(url);
    expect(parsed).toEqual({
      user: 'jthegedus',
      name: 'awesome-firebase'
    });
  });

  it('should initialize repo object', function () {
    const repo = new Repository('https://github.com/amnashanwar/awesome-portfolios');
    expect(repo.user).toEqual('amnashanwar');
    expect(repo.name).toEqual('awesome-portfolios');
  });

});


describe('Link model tests', function () {

  it('should compute uid given url: case 1', function () {
    const uid = Website.computeUid('https://reactnative.dev/subpage');
    expect(uid).toEqual('reactnative.dev.subpage');
  });

  it('should compute uid given url: case 2', function () {
    const uid = Website.computeUid('http://www.github.com/bartolomej/cool-links/#readme');
    expect(uid).toEqual('github.com.bartolomej.cool-links');
  });

})


describe('List model tests', function () {

  it('should normalize url on init', function () {
    const awesome = new List('https://github.com/jthegedus/awesome-firebase/#readme');
    expect(awesome.uid).toEqual('jthegedus.awesome-firebase');
    expect(awesome.url).toEqual('https://github.com/jthegedus/awesome-firebase/#readme');
  });

  it('should validate url on child awesome repo', function () {
    expect(List.isValidUrl('#http')).not.toBeTruthy();
    expect(List.isValidUrl('https://creativecommons.org/publicdomain/zero/1.0 ', true)).not.toBeTruthy();
    expect(List.isValidUrl('https://creativecommons.org/publicdomain/zero/1.0 ', false)).not.toBeTruthy();
    expect(List.isValidUrl('https://github.com/jthegedus/awesome-firebase/#readme', false)).not.toBeTruthy();
    expect(List.isValidUrl('https://github.com/someuser/firebase/#readme', false)).toBeTruthy();
    expect(List.isValidUrl('https://github.com/jthegedus/awesome-firebase/#readme', true)).toBeTruthy();
  });

});
