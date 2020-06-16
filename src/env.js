const envalid = require('envalid');
const { str, num, bool } = envalid;

module.exports = envalid.cleanEnv(process.env, {
  PORT: num({ default: 3000 }),
  TEST_DATA: bool({ default: false }),
  REDIS_URL: str({ default: 'redis://127.0.0.1:6379' }),
  WEB_CONCURRENCY: num({ default: 1 }),
  WEB_WORKERS: num({ default: 2 }),
  CLOUDINARY_CLOUD_NAME: str(),
  CLOUDINARY_API_KEY: str(),
  CLOUDINARY_API_SECRET: str(),
  USE_MEMORY_DB: bool({ default: false })
}, {
  // path to different .env file if provided (such as .env.development)
  dotEnvPath: process.env.ENV_PATH || null
});
