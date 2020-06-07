<div align="center">
	<img width="250" src="https://api.awesomesearch.in/logo.png" alt="Awesome Node.js">
</div>
<br>
<hr>

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)
[![Awesome](https://awesome.re/badge-flat2.svg)](https://awesome.re)
<br>

Awesome web service indexes [awesome](https://awesome.com/sindresorhus/awesome) list collections and exposes search via REST API.

I've also made a [website](https://github.com/bartolomej/awesomesearch-web) and an experimental [Android app](https://github.com/bartolomej/awesomesearch-web).


## Deploying to Heroku

After deploying to Heroku, you will need to [manually scale worker process](https://devcenter.heroku.com/articles/procfile#scaling-a-process-type) with heroku cli command: 
```bash
$ heroku ps:scale worker=1 --app <appname>
```
In order to run [puppeteer](https://pptr.dev/) for website screenshots feature, you need to add the following [buildpack](https://devcenter.heroku.com/articles/buildpacks):
```bash
$ heroku buildpacks:add jontewks/puppeteer --app <appname>
```

## Architecture
App consists of two separate processes:
- `web` (entry file `src/web/index.js`): 
    - receives HTTP requests from clients
    - dispatches jobs to redis queue
    - performs search queries
    - stores data
- `worker` (entry file `src/worker.js`): 
    - performs website scraping
    - list parsing
    - website screenshots

You can configure the number of instances for each processes with environmental variables `WEB_CONCURRENCY` (for web process) and `WEB_WORKERS` (for worker process).
To start both processes in production just run `npm start`.

<div align="center">
    <img src="architecture.png" width="500" />
</div>

## Some libraries used
- [flexsearch](https://github.com/nextapps-de/flexsearch) - Next-Generation full text search library for Browser and Node.js
- [bull](https://github.com/OptimalBits/bull) - Premium Queue package for handling distributed jobs and messages in NodeJS
- [typeorm](https://typeorm.io/) - ORM for TypeScript and JavaScript

## Developing

Before running, you need to have [Redis](https://redis.io/) installed and running on your machine. 
Also you need to configure environmental variables defined in `src/env.js` file
- run `yarn install` or `npm i` command to install dependencies
- run `yarn start` or `npm start` to start both app processes in production

## Scripts

- `yarn test` - runs all unit tests
- `yarn start` - start server in production environment
- `yarn start:dev` - start server in development environment
- `node src/scripts/link.js <website-url>` - process website (outputs metadata to `/out`).

## Future Ideas
- topic / keywords extraction from website text
