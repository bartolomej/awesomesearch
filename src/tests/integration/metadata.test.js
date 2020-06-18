const { describe, expect, it, beforeEach, beforeAll } = require("@jest/globals");
const MetaService = require('../../services/metadata');
const imageService = require('../../services/image');
const path = require('path');
const fs = require('fs');
const env = require('../../env');
const { removeDir, makeDir } = require('../../utils');
const { CACHE_DIR_PATH } = require('../../global');

describe('Test screenshot feature', function () {

  beforeEach(async () => await makeDir(CACHE_DIR_PATH));
  afterAll(async () => await removeDir(CACHE_DIR_PATH));

  it('should screenshot website with intro animation', async function () {
    jest.setTimeout(30000);
    const metaService = MetaService({ imageService });

    const out = path.join(CACHE_DIR_PATH, 'uix.png');
    await metaService.screenshotWebsite('https://uix.me/', out);
    expect(fs.existsSync(out)).toBeTruthy();
  });

});

describe('Test metadata processing flow', function () {

  afterAll(async () => await removeDir(CACHE_DIR_PATH));
  beforeAll(async () => {
    require('dotenv').config({ path: path.join(__dirname, '..', '..', '..', '.env.development') })
    await imageService.init(
      process.env.CLOUDINARY_CLOUD_NAME,
      process.env.CLOUDINARY_API_KEY,
      process.env.CLOUDINARY_API_SECRET,
    );
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
