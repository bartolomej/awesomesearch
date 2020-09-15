const routeUtils = require('./utils');
import List from "../../models/list";
import Link from "../../models/link";
import Website from "../../models/website";
import Repository from "../../models/repository";

describe('Route serialization utils tests', function () {

  it('should test emoji serialization', function () {
    expect(routeUtils.serializeEmojis(['zap', 'notebook'])).toEqual([
      {
        key: 'zap',
        url: "https://github.githubassets.com/images/icons/emoji/unicode/26a1.png?v8"
      },
      {
        key: 'notebook',
        url: "https://github.githubassets.com/images/icons/emoji/unicode/1f4d3.png?v8"
      }
    ])
  });

  it('should serialize list object', function () {
    const list = exampleList();
    expect(routeUtils.serializeList(list)).toEqual({
      uid: list.uid,
      object_type: 'list',
      author: 'bartolomej',
      title: list.title,
      description: list.description,
      emojis: [
        {
          key: 'zap',
          url: "https://github.githubassets.com/images/icons/emoji/unicode/26a1.png?v8"
        },
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
    const list = exampleList();

    expect(routeUtils.serializeLink(link, list)).toEqual({
      uid: link.uid,
      object_type: 'link',
      title: link.title,
      description: link.description,
      emojis: [
        {
          key: 'zap',
          url: "https://github.githubassets.com/images/icons/emoji/unicode/26a1.png?v8"
        },
      ],
      url: link.url,
      website_name: link.websiteName,
      website_type: link.websiteName,
      icon_url: link.icon,
      image_url: link.image,
      screenshot_url: link.screenshot,
      source: {
        uid: list.uid,
        title: list.title,
        image_url: list.image
      }
    })
  });

  it('should serialize search result', function () {
    const result = [
      exampleLink(),
      exampleList()
    ];

    const serialized = routeUtils.serializeSearchResult(result, {
      total_results: result.length
    });
    expect(serialized).toEqual({
      total_results: result.length,
      results: expect.any(Array)
    });
    expect(serialized.results[0]).toMatchObject({ uid: result[0].uid });
    expect(serialized.results[1]).toMatchObject({ uid: result[1].uid });
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
