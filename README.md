# Awesome Service [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

Awesome web service indexes [awesome](https://awesome.com/sindresorhus/awesome) list collections and exposes external search REST API.

## API docs

#### Search by word query:
Returns array of results, sorted by relevance.
- `{query}` - words to search
- `{items_per_page}` - number of items per request
- `{page_index}` - enter page index for pagination (returned `null` if no next available)

Request syntax:
```
/search?q={query}&p={page_index}&limit={items_per_page}
```

Example response:
```json
{
"page": "0",
"next": "15",
"result": [
    {
        "object_type": "link",
        "url": "https://github.com/chrs1885/Capable",
        "title": "chrs1885/Capable",
        "type": "object",
        "name": "GitHub",
        "author": null,
        "description": "Keep track of accessibility settings, leverage high contrast colors, and use scalable fonts to enable users with disabilities to use your app. - chrs1885/Capable",
        "image": "https://repository-images.githubusercontent.com/128437025/d1604580-6ad0-11e9-98cd-5ccc5b64f03c",
        "source": "vsouza/awesome-ios",
        "updated": null,
        "tags": [ ]
    }
]
```

## Some libraries used
- [FlexSearch](https://github.com/nextapps-de/flexsearch) - Next-Generation full text search library for Browser and Node.js
- [bull](https://github.com/OptimalBits/bull) - Premium Queue package for handling distributed jobs and messages in NodeJS

## Scripts

- `npm test` - runs all unit tests
- `npm start` - start server in production environment
- `npm start:dev` - start server in development environment
- `npm start:dev:test` - start server in development environment with mocked REST API calls defined in `src/index.js`
