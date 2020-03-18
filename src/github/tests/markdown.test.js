import parse from "../parser";
import { sectionWithNestedLists, titleWithSectionAndSubsections } from "./markdown.data";


describe('Awesome header parsing', function () {

  it('should parse awesome-ecmascript-tools', function () {
    const document = parse(titleWithSectionAndSubsections);
    expect(document).toEqual({
      title: ' ECMAScript 6 Tools ',
      children: [{
        title: 'Transpilers',
        children: expect.any(Array)
      }, {
        title: 'Build-time transpilation',
        children: [{
          title: 'Gulp Plugins',
          children: expect.any(Array)
        }]
      }]
    });
    expect(document.children[0].children[0]).toEqual({
      title: 'Babel',
      url: 'https://github.com/babel/babel',
      description: 'Babel - Turn ES6+ code into vanilla ES5 with no runtime',
      children: []
    });
    expect(document.children[1].children[0].children[0]).toEqual({
      title: 'gulp-babel',
      description: 'Babel: gulp-babel',
      url: 'https://github.com/babel/gulp-babel',
      children: []
    });
  });

  it('should parse nested lists of awesome', function () {
    const document = parse(sectionWithNestedLists);
    expect(document).toEqual({
      title: null,
      children: [{
        title: 'Platforms',
        children: [{
          title: 'Node.js',
          url: 'https://github.com/sindresorhus/awesome-nodejs#readme',
          description: 'Node.js - Async non-blocking event-driven JavaScript runtime.',
          children: [{
            title: 'Cross-Platform',
            url: 'https://github.com/bcoe/awesome-cross-platform-nodejs#readme',
            description: '- Cross-Platform',
            children: []
          },{
            title: 'Depth 2',
            url: 'https://example.com/depth-2',
            description: '- Depth 2 - Example of 3 depth list',
            children: []
          }]
        },{
          title: 'Xamarin',
          url: 'https://github.com/XamSome/awesome-xamarin#readme',
          description: 'Xamarin - Mobile app development IDE, testing, and distribution.',
          children: []
        },{
          title: 'Linux',
          url: 'https://github.com/aleksandar-todorovic/awesome-linux#readme',
          description: 'Linux',
          children: [{
            title: 'Containers',
            url: 'https://github.com/Friz-zy/awesome-linux-containers#readme',
            description: '- Containers',
            children: []
          }]
        }]
      }]
    })
  });

});
