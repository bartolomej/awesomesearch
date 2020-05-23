<div align="center">
	<img width="400" src="https://api.awesomesearch.in/logo.png" alt="Awesome Node.js">
</div>
<br>
<hr>

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)
[![Awesome](https://awesome.re/badge-flat2.svg)](https://awesome.re)
<br>

Awesome web service indexes [store](https://awesome.com/sindresorhus/awesome) list collections and exposes external search REST API.


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
- `web`: receives HTTP requests from clients, performs search queries, stores data
- `worker`: performs longer running tasks (website scraping, repository parsing,..)

![Architecture Diagram](architecture.png)

Define number of each processes with environmental variables`WEB_CONCURRENCY` and `WEB_WORKERS`.
To start both just run `npm start`.

## Some libraries used
- [FlexSearch](https://github.com/nextapps-de/flexsearch) - Next-Generation full text search library for Browser and Node.js
- [bull](https://github.com/OptimalBits/bull) - Premium Queue package for handling distributed jobs and messages in NodeJS

## Developing

- before running, you need to have [Redis](https://redis.io/) installed on your machine. 
- run `yarn install` or `npm i` command to install dependencies
- run `yarn start` or `npm start` to start both app processes in production
- you need to configure environmental variables defined in `src/env.js` file

## Scripts

- `npm test` - runs all unit tests
- `npm start` - start server in production environment
- `npm start:dev` - start server in development environment
- `npm start:dev:test` - start server in development environment with mocked REST API calls defined in `src/index.js`

## Future Ideas
- topic / keywords extraction from website text
