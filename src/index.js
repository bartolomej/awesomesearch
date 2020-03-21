const { green, red } = require('colors');
const { name } = require('../package');
const { env } = require('./utils');


const routes = [
  require('./routes')
];

async function init () {
  require('./server')(routes);
  if (!env.isProduction) {
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
}
