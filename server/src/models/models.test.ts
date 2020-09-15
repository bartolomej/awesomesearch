import Website from "./website";
import Repository from "./repository";
import List from "./list";

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

  it('should parse emoji tokens in description', function () {
    const repo = new Repository('https://github.com/amnashanwar/awesome-portfolios');
    repo.description = ':zap: Awesome Ethereum :smile: Resources';

    expect(repo.emojis).toEqual(['zap', 'smile']);
  });

});


describe('List model tests', function () {

  it('should normalize url on init', function () {
    // @ts-ignore
    const awesome = new List('https://github.com/jthegedus/awesome-firebase/#readme');
    // uuid generation is deterministic (based on url)
    expect(awesome.uid).toEqual('c7549952-ad61-5803-853e-2dc2a278bf59');
    expect(awesome.url).toEqual('https://github.com/jthegedus/awesome-firebase#readme');
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
