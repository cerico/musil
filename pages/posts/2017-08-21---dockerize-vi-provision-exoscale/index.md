---
title: Dockerize VI - Provision on Exoscale
date: '2017-08-21'
layout: post
---

I usually use Digital Ocean and AWS, and we'll run through both of those but we'll start off with [https://www.exoscale.ch/](exoscale.ch) as they were kind enough to give me $10 credit and its always a good idea to try alternatives out.

```
➜  marsden git:(master) ✗ cat bin/exo/provision.sh
```
```
source config/mars.env

docker-machine create --driver exoscale \
  --exoscale-api-key=$exoscaleApiKey \
  --exoscale-api-secret-key=$exoscaleApiSecret \
  --exoscale-image coreos-stable-1298 \
  --exoscale-instance-profile tiny \
  --exoscale-disk-size 10 \
  --exoscale-ssh-user core \
  kemerovo
```

Most of these commands can be found at either docker's github repo or the exoscale site. I had to do a bit of trial and error as I wanted the CoreOS image and not the default ubuntu. This will create us a docker host on exoscale, named 'kemerovo', because I like the name. We'll need to source our apikey and secret from a conf file - making sure its added to .gitignore so we don't publish it. I have a template env file.

```
➜  marsden git:(master) ✗ cat config/mars.env.template
```
```
digital_ocean_machine=
aws_machine=
aws_access_key_id=
aws_secret_access_key=
digitalocean-access-token=
exo_machine=
exoscaleApiKey=
exoscaleApiSecret=
```

API Credentials

These can be found at [https://portal.exoscale.ch/account/profile/api](https://portal.exoscale.ch/account/profile/api)

![exo](https://s3.eu-west-2.amazonaws.com/io1937/ghpages/exo.png)

Now, hopefully we should be able to see our docker-machine.

```
➜  marsden git:(master) ✗ docker-machine ls
```
```
NAME     ACTIVE   DRIVER      STATE   URL   SWARM   DOCKER    ERRORS
alsace     -        amazonec2      Running   tcp://34.226.192.29:2376             v17.05.0-ce
barnowl    -        digitalocean   Running   tcp://139.59.189.142:2376            v1.12.6
coffee     -        virtualbox     Running   tcp://192.168.99.100:2376            v17.06.0-ce
kemerovo   -        exoscale       Running   tcp://159.100.252.246:2376           v1.12.6
```

We can see our kemerovo docker machine running here on exoscale, succesfully provisioned. So now we want to be able to push our app to it. We can push to any of our docker machines, locally or in the cloud.

```
➜  marsden git:(master) ✗ cat Makefile
```
```
start:
	docker-compose up

bundle:
	cd client && npm run build

build:
	docker-compose build && docker-compose up

deploy-do:
	./bin/digital_ocean/deploy.sh

deploy-aws:
	./bin/aws/deploy.sh

deploy-exo:
	./bin/exo/deploy.sh
```

In the makefile, i've linked deploy scripts for 3 providers. I've left provisioning out of the makefile for now, at least until we introduce Ansible. To deploy our containerized app to exoscale, we can just run 'make deploy-exo', which will run the deploy script.

Deploy Scripts
---

```
➜  marsden git:(master) ✗ cat bin/exo/deploy.sh
```
```
source config/mars.env
eval $(docker-machine env $exo_machine)
docker-compose -f docker-compose.prod.yml build && docker-compose -f docker-compose.prod.yml up -d
eval $(docker-machine env -u)
```

This will set our active docker-machine to be kemerovo, for the lifetime of the script only. It will the production versions of the docker-compose script (docker-compose.prod.yml), and it will run it in a detached state (-d), as we want to run it as a background job. Let's look at the production docker-compose.yml.

Compose file
---

```
➜  marsden git:(master) ✗ cat docker-compose.prod.yml
```
```
version: "2"
services:

    web:
        build: ./client
        restart: always

    clojure:
        build: ./clojure
        restart: always

    nginx:
        build: ./proxy
        restart: always
        ports:
            - "80:80"
        links:
            - web
            - clojure
```

Essentially the same as the dev compose file, with four main differences. Firstly, we're no longer mounting volumes or attempting to access either the client or server containers directly. Secondly, we're not specifying a dockerfile, which means the default Dockerfile for each container will be used instead of eg Dockerfile.dev

Thirdly, the nginx container is going to be listening on port 80, not 3100, so we can access it via url. Fourthly, we have a restart always command. As we're running these in the background, if we reboot or there is a problem with anything we want the containers to restart automatically

Nginx
---

Lets look at nginx again this time, at the production version of our mars.conf

```
➜  marsden git:(master) ✗ cat proxy/sites-enabled/mars.conf
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

Here again we see that nginx is going to be listening on port 80 for traffic for 3 specific urls, mars.io37.ml, mars.io137.cf, and mars.cuya.ml (the DO, AWS and exoscale instances)

![dns](https://s3.eu-west-2.amazonaws.com/io1937/ghpages/dns.png)

Free domains are available at [http://dot.tk](http://dot.tk), but they don't allow wildcard subdomains on the free plan, so here I've added in 'mars' by name.

```
➜  marsden git:(master) ✗ cat proxy/default.conf
```
```
server {
    listen 80;
    root /usr/share/nginx/html;
    server_name *.io37.ml *.io37.cf *.cuya.ml;
    location / {
        index index.html;
    }
}
```

Now when we look at our default.conf we can see that if anyone attempts to reach any subdomains they will get an index.html just saying 'mars!'. We can add more subdomains pointing to other containers, as we see fit - and put a generic message here.

AWS + DO
---

Digital Ocean is much the same, provision script

```
➜  marsden git:(master) cat bin/digital_ocean/provision.sh
```
```
source config/mars.env

docker-machine create --driver=digitalocean \
--digitalocean-access-token=$digitalocean-access-token \
--digitalocean-image=coreos-stable \
--digitalocean-region=lon1 \
--digitalocean-size=1GB \
--digitalocean-ssh-user=core barnowl
```

and deploy

```
➜  marsden git:(master) cat bin/digital_ocean/deploy.sh
```
```
source config/mars.env
eval $(docker-machine env $digital_ocean_machine)
docker-compose -f docker-compose.prod.yml build && docker-compose -f docker-compose.prod.yml up -d
eval $(docker-machine env -u)
```

Next

In the next post we'll look at streamlining the orchestration, management and provisioning of our docker machines with Ansible.


