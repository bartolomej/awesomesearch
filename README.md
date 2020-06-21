![](./src/web/public/banner.png)

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)
[![Awesome](https://awesome.re/badge-flat2.svg)](https://awesome.re)
<br>

This application creates an index of the largest collection of cool internet resources called [awesome](https://awesome.com/sindresorhus/awesome). 
It exposes querying functionality via REST API.

I've also made a [web client](https://github.com/bartolomej/awesomesearch.website) and an experimental [dashboard](https://github.com/bartolomej/awesomesearch.dashboard).


## 🚀 Deploy to Heroku

You can deploy your own instance of this server in a few minutes by following these steps:

1. **Click deploy to heroku button**

    Heroku will automatically setup deployment environment for you.

2. **Scale worker process to a single instance**

    Because this uses heroku's free plan, you need to manually scale up the 'worker' process via [heroku cli](https://github.com/heroku/cli).

   ```shell
   heroku ps:scale worker=1 --app <appname>
   ```

## 💜 Some libraries used

- [flexsearch](https://github.com/nextapps-de/flexsearch) - Next-Generation full text search library for Browser and Node.js
- [bull](https://github.com/OptimalBits/bull) - Premium Queue package for handling distributed jobs and messages in NodeJS
- [typeorm](https://typeorm.io/) - ORM for TypeScript and JavaScript

## ⚙️ Running locally

You can run this app on your local machine as well, but you will need to set up a few things first:

1. **Clone this repository**

    Move to your desired directory and run the following git command.

    ```shell
       git clone https://github.com/bartolomej/awesomesearch.server
    ```
    
2. **Install and run Redis server**

    This is needed for job queue functionality. Install from [here](https://redis.io/).

2. **Setup environmental variables**

    Here we will define private credentials for our app to use. This follows [12 factor app methodology](https://12factor.net/config).
    Required environmental variables are listed in `.env.example` file.
    
3. **Install dependencies and start the app**

    In your project root run `yarn install` or `npm i` to install required packages.
    You can then finally start the app in development mode with `yarn start:dev` or `npm start:dev`/
    

## 🏗️ Architecture

This app consists of two separate processes:
- `web` (entry file `src/web/index.js`): 
    - receives HTTP requests from clients
    - dispatches jobs to redis queue
    - performs search queries
    - interacts with database
- `worker` (entry file `src/worker.js`): 
    - performs website scraping
    - list parsing
    - website screenshots

You can configure the number of instances for each processes with environmental variables `WEB_CONCURRENCY` (for web process) and `WEB_WORKERS` (for worker process).
To start both processes in production just run `npm start`.

<div align="center">
    <img src="architecture.png" width="500" />
</div>

## 🔨 Testing

- **Unit & integration tests**

    These tests validate that isolated and connected modules of code work well. Run with `yarn run test`.

- **Performance tests**

    These test real life performance of our application by simulating what normal users would do.
    To run these you will need to install [artillery tool](https://artillery.io/) and then run `yarn run test:load:staging`.

## :memo: License

Licensed under the [MIT License](./LICENSE).
