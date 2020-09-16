const envalid = require('envalid');
const { str, num } = envalid;
const { join } = require('path');
const { EnvMissingError } = require('envalid');
const chalk = require('chalk');
const RULE = chalk.grey('================================')

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

// same as default reporter but doesn't exit the process
// code taken from https://github.com/af/envalid/blob/master/src/reporter.js
function reporter ({ errors, env }) {
  const errorKeys = Object.keys(errors)
  if (!errorKeys.length) return

  const missingVarsOutput = []
  const invalidVarsOutput = []
  for (const k of errorKeys) {
    const err = errors[k]
    if (err instanceof EnvMissingError) {
      missingVarsOutput.push(`    ${chalk.blue(k)}: ${errors[k].message || '(required)'}`)
    } else invalidVarsOutput.push(`    ${chalk.blue(k)}: ${errors[k].message}`)
  }

  // Prepend "header" output for each section of the output:
  if (invalidVarsOutput.length) {
    invalidVarsOutput.unshift(` ${chalk.yellow('Invalid')} environment variables:`)
  }
  if (missingVarsOutput.length) {
    missingVarsOutput.unshift(` ${chalk.yellow('Missing')} environment variables:`)
  }

  const output = [
    RULE,
    invalidVarsOutput.join('\n'),
    missingVarsOutput.join('\n'),
    chalk.yellow('\n Exiting with error code 1'),
    RULE
  ]
    .filter(x => !!x)
    .join('\n')

  console.error(output);
}
