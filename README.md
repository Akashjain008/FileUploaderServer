# PE File Checker and Uploader
This API server supports presigned URLs and sent events to SQS.

### Main features:

- 🐳 Containerized application
- 🚄 [ExpressJS](http://expressjs.com) framework with [TypeScript](https://www.typescriptlang.org/) on the board
- ♻️ Live reload
- 🏇 minified and optimized code for production build
- ✏️ Linting via [ESLint](https://eslint.org) with Airbnb configuration
- 🚑 Code Formatter with [Prettier](https://prettier.io)
- 📘 VSCode configuration: Debug, Settings, Tasks and extension for ESLint, Prettier, TypeScript
- 🚧 Jest for unit testing


## Getting started

Install `Docker` and `Docker Compose` which are used to maximise the convenience of development on local machine.

When both are installed, build the PE File uploader image as follow:

```sh
docker-compose build
```

Run the app:

```sh
docker-compose up
```

Go to:

```
 http://localhost:8080/api/health
```

If you see the following response in the browser:

```
{"status":"OK","data":"2022-02-13T20:05:13.965Z"}
```

It means that everything work as expected. You may start to develop your business logic.
Please scroll down to "How to work with NET.ts" section.

## Getting started, standard way (no containerization)

If you want to run PE File Uploader "standard way" using the `npm` instead of `docker-compose`.

Install dependencies:

```
npm install
```

Run server in dev mode:

```
npm run server:dev
```

## Testing

The Jest test suites are run by executing

```sh
npm test
```

To run tests directly insiide of the NET.ts container:

```sh
docker-compose run web npm run test
```

## Code linting

```sh
npm run lint
```

or insde of the container

```sh
docker-compose run web npm run lint
```


## Logging

```javascript
import logger from '@core/utils/logger';

logger.error('message'); // level 0
logger.warn('message'); // level 1
logger.info('message'); // level 2
logger.http('message'); // level 3
logger.verbose('message'); // level 4
logger.debug('message'); // level 5
```

In development mode, log messages of all severity levels will be printed to the console.
In production mode, only `info`, `warn`, and `error` logs will be printed to the console.


## SwaggerUI

An interactive API documentation of PE File Uploader can be accessed at the path: <http://localhost:8080>/api-docs \
For local development use this: http://localhost:8080/api-docs \

