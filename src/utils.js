const { performance } = require('perf_hooks');
const logger = require('./logger')('utils');


const isRelativeUrl = url => (
  url !== undefined &&
  url !== null &&
  !/http/.test(url)
);

const joinUrls = (rootUrl, path) => {
  if (!isRelativeUrl(path)) {
    return path;
  }
  let urlEndIndex = rootUrl.indexOf('/', 8);
  if (urlEndIndex > 0) {
    return rootUrl.substring(0, urlEndIndex) + path;
  } else {
    let suffixUrl = path[0] === '/' ? path : '/' + path;
    return rootUrl.substring(0, rootUrl.length) + suffixUrl;
  }
};

async function execute (name, promises) {
  const start = performance.now();
  const result = promises instanceof Array
    ? await Promise.all(promises)
    : await Promise.resolve(promises);
  const duration = performance.now() - start;
  // log if execution took more than 2000ms
  if (duration > 2000) {
    logger.info(`${name} took ${duration} ms`);
  }
  return result;
}

module.exports = {
  joinUrls,
  execute,
}
