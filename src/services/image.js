const cloudinary = require('cloudinary').v2;


function init () {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
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
      colors: true // retrieve predominant colors & color histogram
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
