const preview = require('../services/preview');
const path = require('path');
const rimraf = require('rimraf');
const fs = require('fs');

describe('Test preview service', function () {

  beforeEach(() => {
    const dir = path.join(__dirname, 'res');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  });

  afterEach(() => {
    rimraf.sync(path.join(__dirname, 'res'));
  });

  it('should make an screenshot given url', async function () {
    jest.setTimeout(30000);
    const out = path.join(__dirname, 'res', 'example.png');
    await preview.landingImage('https://www.debugbear.com/', out);
    expect(fs.existsSync(out)).toBeTruthy();
  });

});
