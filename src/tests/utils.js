const fs = require('fs');
const { join } = require('path');

module.exports.readFile = function (filePath) {
  const path = join(__dirname, filePath);
  const encoding = { encoding: 'utf-8' };
  return new Promise((resolve, reject) => {
    fs.readFile(path, encoding, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  })
};
