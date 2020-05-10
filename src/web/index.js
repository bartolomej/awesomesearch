const { green, red } = require('colors');
const { name } = require('../../package.json');
const envalid = require('envalid');
const { str, bool, num } = envalid;
const { workQueue } = require('./service');
const { setQueues } = require('bull-board')

envalid.cleanEnv(process.env, {
  PORT: num({ default: 3000 }),
  NODE_ENV: str({ default: 'production' }),
  TEST_DATA: bool({ default: false }),
  REDIS_URL: str({ default: 'redis://127.0.0.1:6379' }),
});

const routes = [
  require('./routes')
];

async function init () {
  setQueues([workQueue]);
  require('./server')(routes);
  if (!process.env.isProduction && process.env.TEST_DATA) {
    setupDevEnvironment();
  }
}

init().then(onSuccess).catch(onError);

function onSuccess () {
  console.log(green(`${name} started 🥳`));
}

function onError (e) {
  console.log(red(`${name} encountered an error 🤕 \n${e.stack}`));
}

function setupDevEnvironment () {
  const fetchMock = require('fetch-mock');
  const data = require('./tests/mock-data');
  fetchMock.get(
    'https://api.github.com/repos/sindresorhus/awesome/readme',
    data.awesomeRootMarkdown
  );
  fetchMock.get(
    'https://api.github.com/repos/sindresorhus/awesome-nodejs',
    data.nodeJsInfo
  );
  fetchMock.get(
    'https://api.github.com/repos/sindresorhus/awesome-nodejs/topics',
    data.nodeJsTopics
  );
  fetchMock.get(
    'https://api.github.com/repos/sindresorhus/awesome-nodejs/readme',
    data.awesomeNodejsMarkdown
  );
  fetchMock.get(
    'https://github.com/sindresorhus/awesome-nodejs#readme',
    data.nodejsHtml
  );
  fetchMock.get('https://reactnative.dev', data.reactNativeHtml);
  fetchMock.get('https://reactjs.org/', data.react);
  fetchMock.get('https://flutter.dev/', data.flutterHtml);
  fetchMock.get('https://kotlinlang.org/', data.kotlinHtml);
  fetchMock.mock('*', 404);
}
