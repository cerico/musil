---
title: Dockerize III - Nginx
date: '2017-08-21'
layout: post
tags: 
  - Docker
  - Nginx
---

The nginx/proxy container serves two purposes. Firstly it will handle requests from the web (port 80/443) and then send those requests to the appropiate container. But secondly it will handle requests *between* containers. In our case we'll have a client container that will need to make requests to the Clojure API container. As they are running on different ports we'll run into CORS errors (where requests from a different domain are automatically dropped). Rather than fiddle about trying to get CORS whitelisting happening within the server container, we can use the nginx container - a cleaner solution.

TLDR / Repo
----

Repository is here [https://github.com/institute1937/marsden](https://github.com/institute1937/marsden) 

Pages
----

* [Part One - Intro](../2017-08-17---dockerize-i-intro/)
* [Part Two - Dockerfiles](../2017-08-18---dockerize-ii-dockerfiles/)
* Part Three - Nginx
* [Part Four - Client App](../2017-08-21---dockerize-iv-client-container/) 
* [Part Five - Server App](../2017-08-21---dockerize-v-clojure-container/) 
* [Part Six - Provisioning](../2017-08-21---dockerize-vi-provision-exoscale/ )
* [Part Seven - Connect Existing](../2017-08-23---dockerize-vii-connect-existing-machine/) 
* Part Eight - Ansible - soon

Client
------

```
➜  marsden git:(master) cat client/server.js
```
```
var path = require('path')
var express = require('express');
var server = express();

server.use(express.static('.'));
console.log(process.env.PORT)
server.use(express.static(path.join(__dirname, './dist')));
server.listen(process.env.PORT || 5000);
```

Server
------

```
➜  marsden git:(master) ✗ cat clojure/src/hidere/core.clj
```
```
(ns hidere.core
  (:use [org.httpkit.server] [clojure.data.json :only [json-str]])
  (:gen-class))

(defn say-hello [request]
  {:status 200
   :headers {"Content-Type" "application/json"}
   :body    (json-str {"message" "and I'm from Clojure"})})

(use 'ring.adapter.jetty)

(run-jetty say-hello {:port 3009})
```

We can see that our client app is running on port 5000 and our clojure app on port 3009. If we wanted to, we could also run them individually, bypassing nginx and docker altogether, which we'll look at in the next couple of posts.

API Request
-----------

```
➜  marsden git:(master) ✗ cat client/src/js/index.js
```
```
  const host = window.location.host

  const API = 'http://' + host + '/clojure';
  fetch(API).then(function(res){
```

Truncated output here as we'll look at this in more detail later, all we really need to know right now is that the client app is going to make a request to the clojure API - and then it doesn't request this on a separate port. It doesn't even know about any other ports.

nginx
-----

Let's look back at our nginx dockerfile

```
➜  marsden git:(master) ✗ cat proxy/Dockerfile
```
```
FROM nginx

COPY default.conf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf
COPY sites-enabled/* /etc/nginx/sites-enabled/
COPY index.html /usr/share/nginx/html
```

We're going to copy 4 files into the container. Let's go through each of them.

nginx.conf
----

```
➜  marsden git:(master) ✗ cat proxy/nginx.conf
```
```
events{

}

http {
  include /etc/nginx/conf.d/*.conf;
  include /etc/nginx/sites-enabled/*;
}
```

This is the nginx entry point, all this is going to do is include a default file, and then any conf files for sites that are enabled - in our case we have two - mars production, and mars dev.

```
➜  marsden git:(master) ✗ ls proxy/sites-enabled/
```
```
mars.conf     mars.dev.conf
```

All files here are aggregated into the main nginx.conf file, so no duplication in these files is permitted.

mars.dev.conf
------

```
➜  marsden git:(master) cat proxy/sites-enabled/mars.conf
```
```
upstream front {
    server web:5000;
}

upstream back {
    server clojure:3009;
}

server {
    listen 80;
    server_name mars.io37.ml mars.io37.cf mars.cuya.ml;
    location / {
        proxy_pass http://front;
    }
    location /clojure {
        proxy_pass   http://back;
    }
}
```
```
➜  marsden git:(master) cat proxy/sites-enabled/mars.dev.conf
```
```
server {
    listen 3100;
    location / {
        proxy_pass http://front;
    }
    location /clojure {
        proxy_pass   http://back;
    }
}
```

We'll start with the dev file as we'l be running locally first. When we run 'make start' or 'docker-compose up' to launch the application, it will listen on port 3100 (http://localhost:3100). If we go to http://localhost:3100/ we should see the

![3100](https://s3.eu-west-2.amazonaws.com/io1937/ghpages/3100.png)

We make a request for / on port 3100, and nginx makes a request on port 5000, which is where the client app is running (upstream front). The client app makes a request for /clojure, also on 3100 and nginx requests on port 3009 where the clojure app is running (upsteam back).

We can make this request directly if we like.

![3100clj](https://s3.eu-west-2.amazonaws.com/io1937/ghpages/3100clj.png)

Here we are requesting the api /clojure directly, nginx fetches it for us and hands it directly to us in the browser

We can also access each container directly, for troubleshooting. If we remember back to our main docker-compose.yml.

```
➜  marsden git:(master) ✗ cat docker-compose.yml
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

    clojure:
        build: ./clojure
        volumes:
          - "./clojure:/build"
        working_dir: /build
        command: 'lein run'
        ports:
          - 6801:3009

    nginx:
        build: ./proxy
        ports:
            - "3100:3100"
        links:
            - web
            - clojure
```


Nginx accesses both containers by their internal ports, 5000 and 3009. But via the docker-compose port mapping we can also do the same, by their externally mapped ports 6800 and 6801

![6800](https://s3.eu-west-2.amazonaws.com/io1937/ghpages/6800.png)

![6801](https://s3.eu-west-2.amazonaws.com/io1937/ghpages/6801.png)

But here we can see that the client app isn't able to connect to the api /clojure endpoint without nginx. We can also see if we try and connect directly to it on that port. 

![no](https://s3.eu-west-2.amazonaws.com/io1937/ghpages/no.png)

default.conf
-----

We're not using this file in development, so we'll come back to this when we push to production, but lets take a quick look

```
server { 
    listen 80; 
    root /usr/share/nginx/html;
    server_name *.io37.ml *.io37.cf;
    location / { 
        index index.html;
    } 
}
```

Here we will listen for any url not explicitly named in any of the sites-enabled/*.conf files. Essentially its a catch for mistyped urls. In our case it loads a one word index.html

```
➜  marsden git:(master) ✗ cat proxy/index.html
Mars!
```
In the next post, we'll move on to the client container.








