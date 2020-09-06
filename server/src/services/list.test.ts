import ListService from './list';

const exampleReadme = `
## Contents

- [Packages](#packages)
- [Mad science](#mad-science)
- [Command-line apps](#command-line-apps)

## Packages

### Mad science

- [rn](https://reactnative.dev/) - Streaming torrent client for Node.js and the browser.
- [r](https://reactjs.org/) - Streaming torrent client for Node.js and the browser.
- [r](https://flutter.dev/) - Streaming torrent client for Node.js and the browser.
- [r](https://kotlinlang.org/) - Streaming torrent client for Node.js and the browser.
`

describe('List service tests', function () {

  it('should parse awesome-ecmascript-tools', async function () {
    const listService = ListService({});
    const links = listService.parseReadme(exampleReadme);
    expect(links).toEqual([
      "https://reactnative.dev",
      "https://reactjs.org",
      "https://flutter.dev",
      "https://kotlinlang.org",
    ]);
  });

})
