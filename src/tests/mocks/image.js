const logger = require('../../logger')('mock-image-service');

function MockImageService () {
  logger.info(`Initializing mock image service`);

  function remove (uid) {
    logger.info(`Removing image: ${uid}`);
    return {};
  }

  function upload (inputPath, uid) {
    logger.info(`Uploading image: ${uid} from ${inputPath}`);
    return {};
  }

  return { remove, upload };
}

module.exports = MockImageService;
