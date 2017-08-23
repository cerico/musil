---
title: Let's Get Dockerized. Part I
date: '2017-08-17'
layout: post
tags:
  - docker
  - compose
  - nginx
  - clojure
  - javascript
  - coreos
  - deployment
  - exoscale
  - aws
  - digital ocean
  - ansible
  - vagrant
---

In this series we're going to look at how to build a fully containerized full stack application running locally and in the cloud. We're going to use the following.

1. Docker
    * Machine
    * Compose
2. Nginx
3. Clojure
4. Vanilla JS 
    * Webpack
5. CoreOS
6. Deployment
    * Exoscale
    * AWS
    * Digital Ocean
7. Ansible
8. Vagrant
9. Continuous Integration

We will build 3 linked containers, one Javascipt, a second API container with Clojure, and a proxy container running nginx. Using a reverse proxy to connect our two containers means we can run them on separate ports and not have to worry about issues with CORS.

TLDR / Repo
----

Repository is here [https://github.com/institute1937/marsden](https://github.com/institute1937/marsden) 

Tree
----

Lets start by having a look at the project structure.

```
➜  marsden git:(master) tree 
```
```

├── Makefile
├── bin
│   ├── aws
│   │   └── deploy.sh
│   ├── digital_ocean
│   │   └── deploy.sh
│   ├── exo
│   │   ├── deploy.sh
│   │   └── provision.sh
├── client
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   ├── dist
│   │   └── bundle.js
│   ├── index.html
│   ├── node_modules
│   ├── package.json
│   ├── server.js
│   ├── src
│   │   ├── css
│   │   │   └── style.css
│   │   └── js
│   │       └── index.js
│   ├── webpack.config.js
│   └── webpack.prod.config.js
├── clojure
│   ├── Dockerfile
│   ├── src
│   │   └── hidere
│   │       └── core.clj
├── config
│   ├── mars.env
│   └── mars.env.template
├── docker-compose.prod.yml
├── docker-compose.yml
└── proxy
    ├── Dockerfile
    ├── default.conf
    ├── index.html
    ├── nginx.conf
    └── sites-enabled
        ├── mars.conf
        └── mars.dev.conf
```
 
At the top level of the repo we have the client container, the server container (clojure), and the proxy container. A scripts directory (bin) and a config directory for environment variables. Then we have our main docker-compose files, one for dev and one for production. Finally we have the Makefile, which we'll use to control the entire project

Makefile
--------

Lets start with the Makefile

```
➜  marsden git:(master) more Makefile
```
```
start:
        docker-compose up

bundle:
        cd client && npm run build

build:
        docker-compose up --build

deploy-do:
        ./bin/digital_ocean/deploy.sh

deploy-aws:
        ./bin/aws/deploy.sh

deploy-exo:
        ./bin/exo/deploy.sh

```

each command is run from terminal as follows.

```
➜  marsden git:(master) make start
docker-compose up
Recreating marsden_web_1 ...
Recreating marsden_clojure_1 ...
Recreating marsden_web_1
Recreating marsden_web_1 ... done
Recreating marsden_nginx_1 ...
Recreating marsden_nginx_1 ... done
Attaching to marsden_clojure_1, marsden_web_1, marsden_nginx_1
```

We're using the makefile primarily as a front end for docker commands and also for some deployment scripts, which we'll come to later. For now we'll just look at start, bundle and build.

* Start - This just runs 'docker-compose up', which will read the docker-compose.yml

* Bundle - This will cd into our client container and run npm build, which will use webpack to build a production bundle.

* Build - We run this if we have added any packages to any of our containers and want to have those included in the build.

Now lets take a look at the docker-compose.yml. This is the docker-compose file we'll be using in development.

```
➜  marsden git:(master) more docker-compose.yml
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

A straightforward file, with 3 services - or containers. Web, Clojure, and Nginx. Let's run through each of the components in each container.

* build
	*  If we only had one container we might keep eveything in the top level, but we have 3, client, clojure and proxy. As we will see shortly, each of these has its own Dockerfile, so in each container we build one level down. For the web/client container we're specifying a particular dockerfile, so we need to pass the build section the dockerfile name as well.

* volumes
	* This is only present in the client container. We'll mount our client container on a /build directory (this is created in the clients Dockerfile, and we'll see that in the next post. We also have node_modules under the build directory for all the js packages.

* working_dir / command
	* We're specifiying the /build directory as our client root to run our launch command - 'npm run dev'. This will read the package.json file which is at the top level and mapped with the volume section.

* ports
	* This is a mapping of the ports running inside the container to the ones we will access it from on the 'outside'. If we were to cd into the client container and run 'npm run dev', eg bypassing docker altogether, then our client app would be available on port 1998. Running via docker-compose up (or make start) this is mapped to port 6800, which is where we'll access it in the browser.
  	* The clojure app runs on 3009 internally and 6801 with docker.

* links
	* This is our reverse proxy. It links both our containers together, this means the front and back can access each other without needing to worry about CORS issues. It also means we don't need to handle CORS inside the Clojure app, nginx will do that for us. As this is our dev docker-compose we'll be using 3100 not 80 or 443.

Up next!

In the next section we'll look at the Dockerfiles for each of the containers

