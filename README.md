# QuestBnB [![Build Status](https://travis-ci.org/dcocchia/QuestBnB.svg?branch=master)](https://travis-ci.org/dcocchia/QuestBnB)

## Building locally

After cloning the repo onto your machine:

```js
cd your/local/directory/QuestBnb
npm install
gulp
gulp develop
```

The node app will run on http://localhost:3000/ by default. 

## Config

A config containing private data, such as api keys, is required for most of the application to work. To create you own config, create a JSON file named config.json at the root folder that looks like this:

```js
{
	"ZilyoApiKey": "yourZilyoAPIKey",
	"dbConnectionString": "mongoDBConnectionString"
}
```

**Do not commit your config file to a repo**
If you do this by accident, GitHub has a [tutorial](https://help.github.com/articles/remove-sensitive-data/) to get you out of a bind. :relieved:

This repo has the config file in the .gitignore file, as well.

### ZilyoApiKey
You can get a Zilyo api key from [Mashape](https://www.mashape.com/zilyo/zilyo)

### dbConnectString
The db connection string is the pointer to the mongoDB instance you'll be using. It should be an instance of [Mongo's connection string](http://docs.mongodb.org/manual/reference/connection-string/).

The string will default to "QuestBnB" if no config file is present or if the dbConnectString does not exist. In this case, if you have a local MongoDB instance running with a database named "QuestBnB" and a collection called "trips", you should be good to go!

## Creating a production build

This will create a minified version of the bundle.js with sourcemaps. It will also run unit tests, generate a code coverage report, and run JS linting.

```js
gulp build
```

## Develop

To run the node app on http://localhost:3000/

```js
gulp develop
```

Changes to most files will trigger a build and node restart. Nodemon can get into a never ending loop of build -> notice change -> build. The best way to get around this is just to kill the process, run the "gulp" command and start develop again. :grimacing:

## Test

Run unit tests. This will also generate a code coverage report via istanbul

```js
gulp test
```

To just run linting:
```js
gulp lint
```

## Compile LESS

.less files from the /public/app/less folder will be compiled into css in the /public/app/css folder

```js
gulp less
```

## Compile JSX

.jsx files from the /views folder will be compiled into javascript in the public/views folder

```js
gulp jsx
```

## Create Browserify bundle

To create unminified bundle.js under the /public folder:

```js
gulp browserify
```

To create minified bundle.js and sourcemap bundle.js.map under /public folder:

```js
gulp browserify-build
```

Both of these will first run JSX compiling before building the bundle.js file