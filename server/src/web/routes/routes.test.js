const routeUtils = require('../../web/routes/utils');
const List = require('../../models/list');
const Link = require('../../models/link');
const Website = require('../../models/website');
const Repository = require('../../models/repository');

describe('Route serialization utils tests', function () {

  it('should test emoji serialization', function () {
    expect(routeUtils.serializeEmojis(['zap', 'notebook'])).toEqual([
      { key: 'zap', url: "https://github.githubassets.com/images/icons/emoji/unicode/26a1.png?v8" },
      { key: 'notebook', url: "https://github.githubassets.com/images/icons/emoji/unicode/1f4d3.png?v8" }
    ])
  });

  it('should serialize list object', function () {
    const list = exampleList();
    expect(routeUtils.serializeList(list)).toEqual({
      uid: list.uid,
      object_type: 'list',
      title: list.title,
      description: list.description,
      emojis: [
        { key: 'zap', url: "https://github.githubassets.com/images/icons/emoji/unicode/26a1.png?v8" },
      ],
      url: list.url,
      stars: list.stars,
      forks: list.forks,
      tags: list.tags,
      website_name: list.websiteName,
      image_url: list.image,
    })
  });

  it('should serialize link with source object', function () {
    const link = exampleLink();
    link.source = exampleList();

    expect(routeUtils.serializeLink(link)).toEqual({
      uid: link.uid,
      object_type: 'link',
      title: link.title,
      description: link.description,
      emojis: [
        { key: 'zap', url: "https://github.githubassets.com/images/icons/emoji/unicode/26a1.png?v8" },
      ],
      url: link.url,
      website_name: link.websiteName,
      website_type: link.websiteName,
      icon_url: link.icon,
      image_url: link.image,
      screenshot_url: link.screenshot,
      tags: link.tags,
      source: {
        uid: link.source.uid,
        title: link.source.title,
        image_url: link.source.image
      }
    })
  });

  it('should serialize link with source uid', function () {
    const link = exampleLink();
    link.source = 'some.example'

    expect(routeUtils.serializeLink(link)).toEqual({
      uid: link.uid,
      object_type: 'link',
      title: link.title,
      description: link.description,
      emojis: [
        { key: 'zap', url: "https://github.githubassets.com/images/icons/emoji/unicode/26a1.png?v8" },
      ],
      url: link.url,
      website_name: link.websiteName,
      website_type: link.websiteType,
      icon_url: link.icon,
      image_url: link.image,
      screenshot_url: link.screenshot,
      tags: link.tags,
      source: link.source
    })
  });

  it('should serialize search result', function () {
      const result = {
        page: 0,
        next: null,
        result: [
          exampleLink(),
          exampleList()
        ]
      }
      const serialized = routeUtils.serializeSearchResult(result);
      expect(serialized).toEqual({
        ...result,
        result: expect.any(Array)
      });
      expect(serialized.result[0]).toMatchObject({ uid: result.result[0].uid });
      expect(serialized.result[1]).toMatchObject({ uid: result.result[1].uid });
  });

})

function exampleLink (urlPostfix = '') {
  const website = new Website(`https://example.com${urlPostfix}`, 'example');
  const repository = new Repository(`https://github.com/user/example${urlPostfix}`);
  repository.stars = 12;
  repository.forks = 23;
  repository.topics = ['test'];
  repository.description = ':zap: Awesome Ethereum Resources';
  return new Link(`https://github.com/user/example${urlPostfix}`, 'user.example', website, repository);
}

function exampleList (urlPostfix = '') {
  const repository = new Repository(`https://github.com/bartolomej/bookmarks${urlPostfix}`);
  repository.stars = 12;
  repository.forks = 23;
  repository.topics = ['test'];
  repository.description = ':zap: Awesome Ethereum Resources';
  return new List(`https://github.com/user/example${urlPostfix}`, repository);
}
