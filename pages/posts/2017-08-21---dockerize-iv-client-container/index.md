---
title: Dockerize IV - Client Container
date: '2017-08-21'
layout: post
tags: 
  - docker
  - webpack
  - node
  - javascript
---

We want our client and server containers to be as simple as possible. Our client container is very straightforward. It is only going to do two things, firstly display the message "I am from js", and secondly make a get request to the Clojure API and display the message it receives - which should be "and I'm from Clojure".

TLDR / Repo
----

Repository is here [https://github.com/institute1937/marsden](https://github.com/institute1937/marsden) 

Pages
----

* [Part One - Intro](../2017-08-17---dockerize-i-intro/)
* [Part Two - Dockerfiles](../2017-08-18---dockerize-ii-dockerfiles/)
* [Part Three - Nginx](../2017-08-21---dockerize-iii-nginx/) 
* Part Four - Client App
* [Part Five - Server App](../2017-08-21---dockerize-v-clojure-container/) 
* [Part Six - Provisioning](../2017-08-21---dockerize-vi-provision-exoscale/ )
* [Part Seven - Connect Existing](../2017-08-23---dockerize-vii-connect-existing-machine/) 
* Part Eight - Ansible - soon

Lets start with reminding ourselves of our docker setup for the client.

```
➜  marsden git:(master) cat client/Dockerfile.dev
```
```
FROM node:8.2.1-alpine

ADD . /src
WORKDIR /src
RUN /usr/local/bin/npm install
```

```
➜  marsden git:(master) cat docker-compose.yml
```
```
version: "2"
services:

    web:
        build:
          context: ./client
          dockerfile: Dockerfile.dev
        volumes:
          - "./client:/build"
          - /build/node_modules
        working_dir: /build
        command: 'npm run dev'
        ports:
          - 6800:5000
```

```
➜  marsden git:(master) cat Makefile
```
```
start:
	docker-compose up

bundle:
	cd client && npm run build

build:
	docker-compose up --build
```

We'll run 'make start' when we want to run as normal, and 'make build' if we've made changes like installing new packages. When we run make build, npm install runs inside the client container, installing new packages. If we just run 'make start' then 'npm run dev' is run inside the client, as per the docker-compose.yml. Let's have a look at that.

npm run dev
-----------

```
➜  marsden git:(master) cat client/package.json
```
```
{
  "name": "yesmate",
  "version": "1.0.0",
  "description": "",
  "main": "js/index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "webpack-dev-server --host 0.0.0.0 --env.dev"
```

'npm run dev' runs the webpack-dev-server, its important to note the host specified as 0.0.0.0. Its not reachable via docker without specifying this address.

Webpack
----

```
➜  marsden git:(master) cat client/webpack.config.js
```
```
module.exports = options => {
  return {
    entry: './src/js/index.js',
    output: {
      filename: 'bundle.js',
    },
    devtool: 'source-map',
    devServer: {
       port: 5000,
       disableHostCheck: true
    },
  }
}
```

Webpack is out of the scope of this series, what we're mainly interested with here is the fact that its going to run the dev build on port 5000, which is where nginx will route client traffic to. Other than that webpacks job is to bundle our src js files into one bundle and then serve it on that port.

Javascript
---

All our JS in one index file with one function. Its job is to output two messages, one of its own and one it gets from the clojure API.

```
➜  marsden git:(master) cat client/src/js/index.js
```
```
document.body.onload = addElement;

function addElement () {
  let currentDiv = document.getElementById("front");
  var newDiv = document.createElement("div");
  var newContent = document.createTextNode("I am from js");
  newDiv.appendChild(newContent); //add the text node to the newly created div.
  currentDiv.appendChild(newDiv)

  const host = window.location.host

  const API = 'http://' + host + '/clojure';
  fetch(API).then(function(res){
    res.json().then(body => {
       var newDiv = document.createElement("div");
       var newContent = document.createTextNode(body.message)
       newDiv.appendChild(newContent); //add the text node to the newly created div.
       currentDiv.appendChild(newDiv)
    });
  })
}
```

The addElement function runs when body is loaded. It creates one div, makes an API call and then creates a second div. The important thing to note here is that the API URL is our current url and the clojure directory. No reference to any other ports, we're decoupled.

Production
---

We're not ready to deploy yet, but let's look at how our production setup will work.

```
➜  marsden git:(master) cat Makefile
```
```
start:
	docker-compose up

bundle:
	cd client && npm run build
```

'make bundle' will cd into the client folder and run npm build

```
➜  marsden git:(master) cat client/package.json
```
```
{
  "name": "yesmate",
  "version": "1.0.0",
  "description": "",
  "main": "js/index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "webpack-dev-server --host 0.0.0.0 --env.dev",
    "build": "webpack --config webpack.prod.config.js  --env.prod",
```


Which builds us a production bundle...

```
➜  marsden git:(master) cat client/webpack.prod.config.js
```
```
const path = require('path')

module.exports = options => {
  return {
    entry: './src/js/index.js',
    output: {
      path: path.join(__dirname, './dist'),
      filename: 'bundle.js',
    }
  }
}
```

Pretty similar to our dev webpack, but it doesn't server anything, it simply outputs our prod ready bundle to the dist folder. We can then use express to serve it, instead of webpack...

```
➜  marsden git:(master) cat client/server.js
```
```
var path = require('path')
var express = require('express');
var server = express();

server.use(express.static('.'));
server.use(express.static(path.join(__dirname, './dist')));
server.listen(process.env.PORT || 5000);
```

Express is going to serve our production bundle on 5000, just the same as webpack did with the dev bundle. And our production Dockerfile is what runs this file.

```
➜  marsden git:(master) cat client/Dockerfile
```
```
FROM node:8.2.1-alpine

COPY . /src
WORKDIR /src
RUN /usr/local/bin/npm install
CMD ["node", "server.js"]
```

Note the extra 'CMD' command not present in the dev dockerfile. 

Next
---

Next up, we'll examine our Clojure API container