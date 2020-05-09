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

module.exports.joinUrls = joinUrls;
