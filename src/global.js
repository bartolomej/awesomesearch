const path = require('path');

// make cache dir invisible with . prefix
const CACHE_DIR_PATH = path.join(__dirname, '..', '.cache');

module.exports = {
  CACHE_DIR_PATH
}
