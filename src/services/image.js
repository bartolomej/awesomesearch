const cloudinary = require('cloudinary').v2;


function init (cloudName, apiKey, apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret
  });
}

async function remove (uid) {
  return new Promise(((resolve, reject) => {
    cloudinary.uploader.destroy(uid, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result)
      }
    })
  }))
}

async function upload (inputPath, uid) {
  return new Promise(((resolve, reject) => {
    cloudinary.uploader.upload(inputPath, {
      public_id: uid,
      folder: 'awesomesearch',
      overwrite: true, // retrieve predominant colors & color histogram
      colors: true, // retrieve predominant colors & color histogram,
      transformation: [
        { width: 600 }
      ]
    }, (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  }))
}

module.exports = {
  init,
  remove,
  upload
};
