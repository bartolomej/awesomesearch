const { describe, expect, it, beforeEach, afterEach, beforeAll } = require("@jest/globals");
const MetaService = require('../../services/metadata');
const imageService = require('../../services/image');
const path = require('path');
const rimraf = require('rimraf');
const fs = require('fs');


describe('Test screenshot feature', function () {

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
    const metaService = MetaService({ imageService });

    const out = path.join(__dirname, 'res', 'example.png');
    await metaService.screenshotWebsite('https://www.debugbear.com/', out);
    expect(fs.existsSync(out)).toBeTruthy();
  });

});

describe('Test metadata processing flow', function () {

  beforeAll(async () => {
    require('dotenv').config({ path: path.join(__dirname, '..', '..', '..', '.env') })
    await imageService.init();
  });

  it('should process metadata for website', async function () {
    jest.setTimeout(30000);
    const metaService = MetaService({ imageService });
    const result = await metaService.getMetadata('https://reactnative.dev/');
    expect(typeof result.website.screenshot === 'string').toBeTruthy();
    expect(typeof result.website.screenshotId === 'string').toBeTruthy();

    await imageService.remove(result.website.screenshotId);
  });

});
