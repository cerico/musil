---
title: Writing Dockerfiles
date: '2017-08-18'
layout: post
tags: 
  - Docker
  - Nginx
brief: Full Stack Docker Application Part 2 - Writing Dockerfiles for the Nginx, Clojure and Javascript containers. 
---

Let's now look at each of our Dockerfiles. Each of the Dockerfiles specifies an image to be used. In order to try and keep size low I've gone for Alpine based images where possible.

### TLDR / Repo


Repository is here [https://github.com/institute1937/marsden](https://github.com/institute1937/marsden) 

___

### Pages


* [Part One - Intro](../2017-08-17---dockerize-i-intro/)
* Part Two - Dockerfiles
* [Part Three - Nginx](../2017-08-21---dockerize-iii-nginx/) 
* [Part Four - Client App](../2017-08-21---dockerize-iv-client-container/) 
* [Part Five - Server App](../2017-08-21---dockerize-v-clojure-container/) 
* [Part Six - Provisioning](../2017-08-21---dockerize-vi-provision-exoscale/ )
* [Part Seven - Connect Existing](../2017-08-23---dockerize-vii-connect-existing-machine/) 
* Part Eight - Ansible - soon

___

### Start

```
➜  marsden git:(master) more client/Dockerfile.dev
```
```
FROM node:8.2.1-alpine

COPY . /build
WORKDIR /build
RUN /usr/local/bin/npm install
```

We use Node's Alpine image, mainly as its much smaller than Ubuntu or Debian versions, and we can keep our containers small. Its purpose is to run an npm install of the clients packages found in package.json. You'll notice that there are two Dockerfiles, we're focusing on dev for the moment and will look at the production Dockerfile once we are ready to deploy.

```
➜  marsden git:(newy) more clojure/Dockerfile
```
```
FROM clojure:lein-2.7.1-alpine

COPY . /build
WORKDIR /build
RUN /usr/local/bin/lein deps

CMD ["lein", "run"]
```

Clean decoupling gives an opportunity to look at something else, without it impacting the rest of the project. I've never used Clojure before, so rather than using Express or Rails, this is a good opening to try out a new language. We use Clojure's Alpine image. 'Lein deps' is the equivalent of 'npm install'.

We also have an additional CMD line, running 'lein run'. In the client container we had a command line in the docker-compose.yml, but this can also be in the individual Dockerfile itself. docker-compose.yml overrides the Dockerfile, but in this case we have it here. Mainly for experimentation, and also to show different methods.

```
➜  marsden git:(newy) cat proxy/Dockerfile
```
```
FROM nginx

COPY default.conf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf
COPY sites-enabled/* /etc/nginx/sites-enabled/
COPY index.html /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
```

Finally the nginx container. We use nginx's image, copy in a number of files and launch nginx inside the container. 'daemon off' prevents the container from halting.

___

### Next


In the next section we'll look at those files, and what's happening in the nginx container.
