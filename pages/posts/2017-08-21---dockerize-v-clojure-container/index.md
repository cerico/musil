---
title: Dockerize V - Clojure Container
date: '2017-08-21'
layout: post
tags: 
  - docker
  - clojure
---

I've never used Clojure before building this project. I wanted to have a simple API container that just returned a message and nothing else, and rather than use Rails or Node/Express it seemed a good opportunity to try something completely unknown. Both Clojure and Elixir were at the top of my list, and Clojure won out, thanks to a hard fought best of 5 coin toss.

TLDR / Repo
----

Repository is here [https://github.com/institute1937/marsden](https://github.com/institute1937/marsden) 

Pages
----

* [Part One - Intro](../2017-08-17---dockerize-i-intro/)
* [Part Two - Dockerfiles](../2017-08-18---dockerize-ii-dockerfiles/)
* [Part Three - Nginx](../2017-08-21---dockerize-iii-nginx/) 
* [Part Four - Client App](../2017-08-21---dockerize-iv-client-container/) 
* Part Five - Server App
* [Part Six - Provisioning](../2017-08-21---dockerize-vi-provision-exoscale/ )
* [Part Seven - Connect Existing](../2017-08-23---dockerize-vii-connect-existing-machine/) 
* Part Eight - Ansible - soon

Let's start by reminding ourselves of our docker setup for clojure

```
➜  marsden git:(master) cat clojure/Dockerfile
```
```
FROM clojure:lein-2.7.1-alpine

COPY . /src
WORKDIR /src
RUN /usr/local/bin/lein deps

```

```
➜  marsden git:(master) cat docker-compose.yml
```
```

version: "2"
services:

    clojure:
        build: ./clojure
        volumes:
          - "./clojure:/build"
        working_dir: /build
        command: 'lein run'
        ports:
          - 6801:3009
```

Pretty much a carbon copy of out client dockerfile, with 'lein deps' replacing 'npm install' and lein run replacing 'npm run dev' or 'node server'. We're not running separate dev and prod versions of the clojure app, at least not at this stage.

We'll look at two main files here, the project file, and the core file. The project file lists the dependencies we've used, broadly equivalent of node's package.json

```
➜  marsden git:(master) ✗ cat clojure/project.clj
```
```
(defproject hidere "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :url "http://example.com/FIXMEYES"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :dependencies [[org.clojure/clojure "1.8.0"]
           [ring/ring-core "1.5.0"]
           [ring-cors "0.1.7"]
           [http-kit "2.2.0"]
           [ring/ring-jetty-adapter "1.5.0"]
           [org.clojure/data.json "0.2.6"]]
  :main ^:skip-aot hidere.core
  :target-path "target/%s"
  :profiles {:uberjar {:aot :all}})
  ```
  
Now we can look at the core file.
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

run-jetty runs the say-hello function on port 3009, which returns a JSON message. Thats it! Again, we don't need to worry anything about CORS as nginx will make sure that requests from the client app appear to originate from the same domain or port.

Next
---

Provisioning
