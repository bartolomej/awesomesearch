const envalid = require('envalid');
const { str, num } = envalid;
const { join } = require('path');

const dotEnvPath = process.env.NODE_ENV !== 'production'
  ? join(__dirname, '..', '.env.development')
  : null;

export const webEnv = () => envalid.cleanEnv(process.env, {
  PORT: num({ default: 3000 }),
  REDIS_URL: str({ default: 'redis://127.0.0.1:6379' }),
  WEB_CONCURRENCY: num({ default: 1 }),
  DB_URL: str(),
  DB_HOST: str({ default: 'localhost' }),
  DB_USERNAME: str(),
  DB_PASSWORD: str(),
  DB_NAME: str(),
  GH_USERNAME: str(),
  GH_TOKEN: str()
}, {
  dotEnvPath,
  reporter
});

export const workerEnv = () => envalid.cleanEnv(process.env, {
  REDIS_URL: str({ default: 'redis://127.0.0.1:6379' }),
  LIST_WORKER_CONCURRENCY: num({ default: 1 }),
  LINK_WORKER_CONCURRENCY: num({ default: 3 }),
  CLOUDINARY_CLOUD_NAME: str(),
  CLOUDINARY_API_KEY: str(),
  CLOUDINARY_API_SECRET: str(),
  GH_USERNAME: str(),
  GH_TOKEN: str()
}, {
  dotEnvPath,
  reporter
});

function reporter ({ errors, env }) {
  console.warn(`Some env variables may be configured incorrectly!`)
  errors.forEach(err => {
    console.error(err.message)
  });
}
