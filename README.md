# Project Setup - Survey User Interface

> A Vue.js project

## Build Setup

Before installing dependencies run the following to check your npm version:

``` bash
npm version
```

If your version is not at least 3 or if you don't have npm installed then you need to handle that first. Use the following link as a guide: https://docs.npmjs.com/getting-started/installing-node

Next install all dependencies with the following command:

``` bash
npm install
```

Next you need to create a new file called `environment.js` in the src folder. This will be used to pull in environment variables intended for use in the dev environment.

In this file you will put in the following code:

``` bash
module.exports = {
	fake_backend: false
}
```

## Working With Project

The following commands will get you up and running:

``` bash
# Start the development server with hot reload at localhost:6969
npm run dev

# Create a production build with minification
npm run build

# Run unit tests
npm run unit

# Run e2e tests
npm run e2e

# Run all tests
npm test
```
