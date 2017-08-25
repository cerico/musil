---
title: Dockerize VIII - SSL
date: '2017-08-25'
layout: post
---

Currently we're running only on http so we want to switch that to https and use SSL. We'll also use the opportunity to have nginx serve something other than our clojure/js app so we can have a bit more of a look at nginx. We can test this out in the debian vm first.

We'll start by adding an entry to our mac's host file.

```
➜  marsden git:(garden) grep york /etc/hosts
192.168.99.150 mars.york
192.168.99.150 hello.york
```

And make a new entry in our sites-enabled list for the nginx container.

```
➜  marsden git:(garden) cat proxy/sites-enabled/hello.conf
```
```
server {
    listen 80;
    server_name hello.*;
    root /usr/share/nginx/html/hello;
    location / {
        try_files $uri $uri/ =404;
    }
}
```

This will serve up a simple hello page. The wildcarding of 'hello.*' means this will work wherever we deploy this to.

```
➜  marsden git:(garden) cat proxy/hello.html
hello there
```

We'll also need to change our Dockerfile to include this new page in the container, as previously we were only including a default index.html.

```
➜  marsden git:(garden) grep html proxy/Dockerfile
COPY index.html /usr/share/nginx/html/
COPY hello.html /usr/share/nginx/html/hello/index.html
```

![alt text](https://s3.eu-west-2.amazonaws.com/io1937/ghpages/hello.png ".")

If there any issues here, you may see your nginx container failing - eg continually recycling.

```
☁  ~  docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED              STATUS                         PORTS               NAMES
1cc4303addd2        marsden_nginx       "nginx -g 'daemon ..."   About a minute ago   Restarting (1) 7 seconds ago                       marsden_nginx_1
```

Now lets look at moving this to https. There are a bunch of great tutorials on creating certificates - and recommend following this one. I created the necessary files in my debian vm, rather than trying to do it on OSX.

[https://www.digitalocean.com/community/tutorials/how-to-create-a-self-signed-ssl-certificate-for-nginx-in-ubuntu-16-04](https://www.digitalocean.com/community/tutorials/how-to-create-a-self-signed-ssl-certificate-for-nginx-in-ubuntu-16-04)

Once you've finished the tutorial, you should have the following files, which we can move into our docker container to be used. The main thing to remember is to add in the FQDN you'll be using when creating the certificates. In our case 'hello.york'.

Once created we should have the following files

```
/etc/ssl/certs/dhparam.pem
/etc/ssl/private/nginx-selfsigned.key
/etc/ssl/certs/nginx-selfsigned.crt
/etc/nginx/snippets/self-signed.conf
/etc/nginx/snippets/ssl-params.conf
```

We can copy these to our proxy container back on the host OS (and remember to add to .gitignore, and we should have

```
➜  marsden git:(garden) ✗ tree proxy/ssl
```
```
proxy/ssl
├── dhparam.pem
├── nginx-selfsigned.crt
├── nginx-selfsigned.key
├── self-signed.conf
├── snippets
│   ├── self-signed.conf
│   └── ssl-params.conf
└── ssl-params.conf

1 directory, 7 files
```

We can now copy these into the docker container as part of its build process

```
➜  marsden git:(garden) ✗ cat proxy/Dockerfile
FROM nginx

COPY default.conf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf
COPY sites-enabled/* /etc/nginx/sites-enabled/
COPY index.html /usr/share/nginx/html/
COPY hello.html /usr/share/nginx/html/hello/index.html
COPY ssl/nginx-selfsigned.crt /etc/ssl/certs/
COPY ssl/nginx-selfsigned.key /etc/ssl/private/nginx-selfsigned.key
COPY ssl/dhparam.pem /etc/ssl/certs/dhparam.pem
COPY ssl/snippets/self-signed.conf /etc/nginx/snippets/
COPY ssl/snippets/ssl-params.conf /etc/nginx/snippets/

CMD ["nginx", "-g", "daemon off;"]
```

Letsencrypt
---





