const service = require('../services/website');
const fetchMock = require('fetch-mock');

// EXTERNAL LIBRARIES TESTS

describe('Fetch mock tests', function () {

  it('should return error given invalid website url', async function () {
    fetchMock.get(
      'https://some-website.com', {
        throws: new Error('request to https://some-website.com failed, reason: getaddrinfo ENOTFOUND some-website.com')
      }
    );
    try {
      await service.getHtml('https://some-website.com');
      expect(1).toBe(2);
    } catch (e) {
      expect(e.message).toEqual('Website not found');
    }
  });

});
