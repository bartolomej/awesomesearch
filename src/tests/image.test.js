const imageService = require('../services/image');
const path = require('path');


describe('Image service tests', function () {

  beforeAll(async () => {
    require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') })
    await imageService.init();
  });

  it('should upload and remove image', async function () {
    const dogImagePath = path.join(__dirname, 'data', 'dog.jpg');
    const uploadRes = await imageService.upload(dogImagePath, 'dog');

    // validate that image is uploaded successfully
    expect(uploadRes.public_id).toEqual('awesomesearch/dog');
    expect(typeof uploadRes.secure_url === 'string').toBeTruthy();

    const removeRes = await imageService.remove(uploadRes.public_id);

    // validate that image was removed
    expect(removeRes.result).toEqual('ok');
  });

})
