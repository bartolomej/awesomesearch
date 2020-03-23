const envalid = require('envalid');
const { str, bool, num } = envalid;

module.exports.env = envalid.cleanEnv(process.env, {
  PORT: num({ default: 3000 }),
  NODE_ENV: str({ default: 'production' }),
  TEST_DATA: bool({ default: false })
});
