<div align="center">
	<img width="400" src="https://api.awesomesearch.in/logo.png" alt="Awesome Node.js">
</div>
<br>
<hr>

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)
[![Awesome](https://awesome.re/badge-flat2.svg)](https://awesome.re)
<br>

Awesome web service indexes [awesome](https://awesome.com/sindresorhus/awesome) list collections and exposes external search REST API.

After deploying to Heroku, you will need to [manualy scale worker process](https://devcenter.heroku.com/articles/procfile#scaling-a-process-type) with heroku cli command: 
```
$ heroku ps:scale worker=1 --app <appname>
```


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
"page": 0,
"next": 15,
"result": [
    {
        "object_type": "link",
        "title": "Level Out",
        "website_name": null,
        "url": "http://level-out.com",
        "image": "https://level-out.com/assets/images/og-image.png",
        "tags": [
          "Level Out",
          "Luke Hedger",
          "Software Engineer"
        ],
        "source": "amnashanwar/awesome-portfolios",
        "website_type": "website",
        "description": "The world needs software that is modern yet stable, balanced skillfully between innovation and standards",
        "author": "Luke Hedger"
    },
    ...
]
```

## Architecture
App consists of two separate processes:
- `web`: receives HTTP requests from clients, performs search queries, stores data
- `worker`: performs longer running tasks (website scraping, repository parsing,..)

Define number of each processes with environmental variables`WEB_CONCURRENCY` and `WEB_WORKERS`.
To start both just run `npm start`.

## Some libraries used
- [FlexSearch](https://github.com/nextapps-de/flexsearch) - Next-Generation full text search library for Browser and Node.js
- [bull](https://github.com/OptimalBits/bull) - Premium Queue package for handling distributed jobs and messages in NodeJS

## Developing

- before running, you need to have [Redis](https://redis.io/) installed on your machine. 
- run `yarn install` or `npm i` command to install dependencies
- run `yarn start` or `npm start` to start both app processes in production

## Scripts

- `npm test` - runs all unit tests
- `npm start` - start server in production environment
- `npm start:dev` - start server in development environment
- `npm start:dev:test` - start server in development environment with mocked REST API calls defined in `src/index.js`
