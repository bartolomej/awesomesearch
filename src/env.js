const envalid = require('envalid');
const { join } = require('path');
const { str, num, bool } = envalid;

module.exports = envalid.cleanEnv(process.env, {
  PORT: num({ default: 3000 }),
  REDIS_URL: str({ default: 'redis://127.0.0.1:6379' }),
  WEB_CONCURRENCY: num({ default: 1 }),
  WEB_WORKERS: num({ default: 2 }),
  CLOUDINARY_CLOUD_NAME: str(),
  CLOUDINARY_API_KEY: str(),
  CLOUDINARY_API_SECRET: str(),
  USE_MEMORY_DB: bool({ default: false }),
  USE_MOCK_IMAGE_SERVICE: bool(({ default: false })),
  GH_USERNAME: str(),
  GH_TOKEN: str()
}, {
  // path to different .env file if provided (such as .env.development)
  dotEnvPath: process.env.ENV_PATH || join(__dirname, '..', '.env.development')
});
