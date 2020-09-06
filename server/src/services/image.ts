import * as cloudinary from 'cloudinary';
import logger from "../logger";

export interface ImageServiceInt {
  remove (uid: string): Promise<any>;

  upload (fsPath: string, uid: string): Promise<any>;
}

interface ImageServiceParams {
  cloudinaryCloudName: string;
  cloudinaryApiKey: string;
  cloudinaryApiSecret: string;
  cloudinaryFolderName?: string
}

export default function ImageService ({
  cloudinaryCloudName,
  cloudinaryApiKey,
  cloudinaryApiSecret,
  cloudinaryFolderName = 'awesomesearch'
}: ImageServiceParams): ImageServiceInt {
  const log = logger('image-service');

  log.debug(`Initializing image service`);

  cloudinary.v2.config({
    cloud_name: cloudinaryCloudName,
    api_key: cloudinaryApiKey,
    api_secret: cloudinaryApiSecret
  });

  async function remove (uid: string): Promise<any> {
    return new Promise(((resolve, reject) => {
      cloudinary.v2.uploader.destroy(uid, (error, result) => (
        error ? reject(error) : resolve(result)
      ))
    }))
  }

  async function upload (inputPath: string, uid: string): Promise<any> {
    return new Promise(((resolve, reject) => {
      cloudinary.v2.uploader.upload(inputPath, {
        public_id: uid,
        folder: cloudinaryFolderName,
        overwrite: true, // retrieve predominant colors & color histogram
        colors: true, // retrieve predominant colors & color histogram,
        transformation: [
          { width: 600 }
        ]
      }, (error, result) => (
        error ? reject(error) : resolve(result)
      ))
    }))
  }

  return { remove, upload }
}
