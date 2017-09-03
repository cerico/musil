---
title: Connect to an existing Docker Machine
date: '2017-08-23'
layout: post
tags: 
  - Docker
brief: Full Stack Docker Application Part 7 - Moving dev environment to Vagrant by connecting Docker Machine to existing Debian and CoreOS docker hosts running in Vagrant VMs.
---

We can use docker-machine to create a boot2docker instance, but if we want to replicate our production exoscale, digital ocean and aws machines as closely as possible we'll want to use CoreOS instead. For this we'll need Vagrant and VirtualBox installed. We'll setup a debian box with vagrant and then try and connect to it with docker-machine and bring it under docker-machine control.

Linking to existing hosts with docker-machine was quite a faff, ultimately I'm not super convinced it was worth it, but none of the solutions I found oneline came anyhere near working - and there's no simple 'docker-machine add' facility.

Let's go with Debian first, this is the basic Vagrantfile I originally used to set up my vm.

___

### TLDR / Repo


Repository is here [https://github.com/institute1937/marsden](https://github.com/institute1937/marsden) 

___

### Pages
----

* [Part One - Intro](../2017-08-17---dockerize-i-intro/)
* [Part Two - Dockerfiles](../2017-08-18---dockerize-ii-dockerfiles/)
* [Part Three - Nginx](../2017-08-21---dockerize-iii-nginx/) 
* [Part Four - Client App](../2017-08-21---dockerize-iv-client-container/) 
* [Part Five - Server App](../2017-08-21---dockerize-v-clojure-container/) 
* [Part Six - Provisioning](../2017-08-21---dockerize-vi-provision-exoscale/ )
* Part Seven - Connect Existing
* Part Eight - Ansible - soon

___

### Host

```
➜  york cat Vagrantfile
```
```
Vagrant.configure("2") do |config|
  config.vm.box = "debian/stretch64"
  config.ssh.forward_agent = true
  config.ssh.forward_x11 = true
  config.vm.network "private_network", ip: "192.168.99.150"
end
```

___

### Guest

I'm connecting as the vagrant user, so we'll need to add the vagrant user to the docker group.

```
sudo usermod -a -G docker vagrant
```

I couldn't get docker to start with systemctl, only with dockerd so I added an extra file in the systemd docker to reflect dockerd.

```
☁  ~ cat /etc/systemd/system/docker.service.d/10-machine.conf
```
```
[Service]
ExecStart=
ExecStart=/usr/bin/docker daemon -H tcp://0.0.0.0:2376 -H unix:///var/run/docker.sock --storage-driver aufs --tlsverify --tlscacert /etc/docker/ca.pem --tlscert /etc/docker/server.pem --tlskey /etc/docker/server-key.pem --label provider=generic
Environment=
```

```
☁  ~  cat /etc/systemd/system/docker.service.d/11-machine.conf
```
```
[Service]
ExecStart=
ExecStart=/usr/bin/dockerd -H fd:// -H tcp://0.0.0.0:2376 -H unix:///var/run/docker.sock --storage-driver aufs --tlsverify --tlscacert /etc/docker/ca.pem --tlscert /etc/docker/server.pem --tlskey /etc/docker/server-key.pem --label provider=generic
```


```
☁  ~  sudo systemctl status docker.service
```
```
● docker.service - Docker Application Container Engine
   Loaded: loaded (/lib/systemd/system/docker.service; enabled; vendor preset: enabled)
  Drop-In: /etc/systemd/system/docker.service.d
           └─10-machine.conf, 11-machine.conf
   Active: active (running) since Wed 2017-08-23 13:25:29 GMT; 32min ago
     Docs: https://docs.docker.com
 Main PID: 451 (dockerd)
    Tasks: 46 (limit: 4915)
   Memory: 137.0M
      CPU: 1min 6.553s
   CGroup: /system.slice/docker.service
           ├─ 451 /usr/bin/dockerd -H fd:// -H tcp://0.0.0.0:2376 -H unix:///var/run/docker.sock --storage-driver aufs --tlsverify --tlscac
           ├─ 465 docker-containerd -l unix:///var/run/docker/libcontainerd/docker-containerd.sock --metrics-interval=0 --start-timeout 2m
           ├─3255 docker-containerd-shim c190933413e6367631e0042175271c0a9f41ad16d6c5633985c8fd4394965a3a /var/run/docker/libcontainerd/c19
           └─3280 docker-containerd-shim 84672d056d205e3b152626c0f4cdf97465b014706d034f58978b5127374dbf13 /var/run/docker/libcontainerd/846
```

docker now running inside vm - now to connect from docker-machine in our host

___

### Back to Host

```
➜  ~ docker-machine create --driver=generic --generic-ip-address 192.168.99.150 --generic-ssh-user=vagrant york
```
```
Running pre-create checks...
Creating machine...
(york) No SSH key specified. Assuming an existing key at the default location.
Waiting for machine to be running, this may take a few minutes...
Detecting operating system of created instance...
Waiting for SSH to be available...
Detecting the provisioner...
Provisioning with debian...
Copying certs to the local machine directory...
Copying certs to the remote machine...
Setting Docker configuration on the remote daemon...
Checking connection to Docker...
Docker is up and running!
To see how to connect your Docker Client to the Docker Engine running on this virtual machine, run: docker-machine env york
```

Make sure your hosts public ssh key (~/.ssh/id_rsa.pub) is added to the vms authorized_keys file (/home/vagrant/.ssh/authorized_keys)

and you should see the debian docker-machine available

```
➜  ~ docker-machine env york
```
```
export DOCKER_TLS_VERIFY="1"
export DOCKER_HOST="tcp://192.168.99.150:2376"
export DOCKER_CERT_PATH="/Users/garethrobertlee/.docker/machine/machines/york"
export DOCKER_MACHINE_NAME="york"
```

```
➜  ~ docker-machine ls
```
```
NAME       ACTIVE   DRIVER         STATE     URL                          SWARM   DOCKER        ERRORS
alsace     -        amazonec2      Running   tcp://34.226.192.29:2376             v17.05.0-ce
coffee     -        virtualbox     Saved                                          Unknown
kemerovo   -        exoscale       Running   tcp://159.100.252.246:2376           v1.12.6
marsden    -        digitalocean   Running   tcp://139.59.189.142:2376            v1.12.6
york       -        generic        Running   tcp://192.168.99.150:2376            v17.06.0-ce
```

We can add a deploy script to push our containers to this machine

```
➜  marsden git:(recordcafe) cat bin/york/deploy.sh
```
```
eval $(docker-machine env york)
docker-compose -f docker-compose.prod.yml build && docker-compose -f docker-compose.prod.yml up -d
eval $(docker-machine env -u)
```

For now I'm just pushing the production environment. We can also later move the dev environment to using the vm's docker. Then we'll have moved all our docker hosts off OSX and onto remote docker machines, leaving OSX to function purely as a controller. 

I've added a new file in sites-enabled, to cater for our local vm, keeping it separate from our production and dev files.

```
➜  marsden git:(recordcafe) cat proxy/sites-enabled/mars.york.conf
```
```
server {
    listen 80;
    server_name 192.168.99.150 mars.york;
    location / {
        proxy_pass http://front;
    }
    location /clojure {
        proxy_pass   http://back;
    }
} 
```

This will listen on the vms ip address, and also on mars.york - which we can setup in the mac's host file.

```
➜  marsden git:(recordcafe) grep 150 /etc/hosts
192.168.99.150 mars.york
```
___

### Troubleshooting

I did get this error...

```
Recreating 6a1cdddb3c96_marsden_nginx_1 ... error

ERROR: for 6a1cdddb3c96_marsden_nginx_1  Cannot start service nginx: driver failed programming external connectivity on endpoint marsden_nginx_1 (ea9a2414d915d3d6c6dc880ab56742e5fbb44874a21f5e5e94f9efdc003ba749): Error starting userland proxy: listen tcp 0.0.0.0:80: bind: address already in use
```

This is because debian's own nginx was running on port 80.
```
☁  ~  ps -ef | grep nginx
root     11460     1  0 09:34 ?        00:00:00 nginx: master process /usr/sbin/nginx -g daemon on; master_process on;
```

So that needs to be turned off

```
☁  ~  sudo /etc/init.d/nginx stop
[ ok ] Stopping nginx (via systemctl): nginx.service.
```

And prevented from attempting to start at boot time.

```
☁  ~  sudo systemctl disable nginx
Synchronizing state of nginx.service with SysV service script with /lib/systemd/systemd-sysv-install.
Executing: /lib/systemd/systemd-sysv-install disable nginx
```

___

### Next

Orchestration with Ansible.






