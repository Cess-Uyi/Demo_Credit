# Demo-Credit
E-Wallet Rest Api Example. Using Node.js, KnexJs ORM and MySQL database.

## Requirements
* [Node v7.6+](https://nodejs.org/en/download/) or [Docker](https://www.docker.com/)
* [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/en/docs/install)

## Getting Started
Clone the repo:
```
https://github.com/Cess-Uyi/Demo_Credit.git
cd Demo_Credit
```

Install dependencies:
```
npm i
```
OR
```
yarn
```

Set environment variables:
```
cp sample.env .env
```

## Running Locally
```
npm run dev
```
OR
```
yarn run dev
```

## Running in Production
npm start

## Migrations
```
knex migrate:latest
```

## API Endpoint
https://success-lendsqr-be-test.herokuapp.com

## API Postman Collection for Testing
https://documenter.getpostman.com/view/15483669/2s8YmF1SK1

## Test
```
npm run test
```
OR
```
yarn run test
```

## DB Design
https://dbdesigner.page.link/isuAPiQqW3xtWNf18

## Deploy
```
git push heroku [current-branch]:master
```