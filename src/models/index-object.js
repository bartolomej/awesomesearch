function IndexObject ({ uid, title, url, websiteName, description, author, tags, type }) {
  return {
    uid,
    title,
    url,
    websiteName,
    description,
    author,
    tags,
    type
  }
}

module.exports = IndexObject;
// required for text search library
// https://github.com/nextapps-de/flexsearch#index-documents-field-search
module.exports.fields = [
  'id',
  'title',
  'url',
  'websiteName',
  'description',
  'author',
  'tags'
]
