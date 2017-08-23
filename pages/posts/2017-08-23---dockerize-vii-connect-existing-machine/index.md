---
title: Dockerize VII - Connect Existing Machine
date: '2017-08-23'
layout: post
---

We can use docker-machine to create a boot2docker instance, but if we want to replicate our production exoscale, digital ocean and aws machines as closely as possible we'll want to use CoreOS instead. For this we'll need Vagrant and VirtualBox installed. We'll setup a debian box with vagrant and then try and connect to it with docker-machine and bring it under docker-machine control.

Linking to existing hosts with docker-machine was quite a faff, ultimately I'm not super convinced it was worth it, but none of the solutions I found oneline came anyhere near working - and there's no simple 'docker-machine add' facility.

Let's go with Debian first, this is the basic Vagrantfile I originally used to set up my vm.

Host
---
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

Guest
---

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

Host
---
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

make sure your hosts public ssh key (~/.ssh/id_rsa.pub) is added to the vms authorized_keys file (/home/vagrant/.ssh/authorized_keys)

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

If docker-machine had a straightforward add command I might be more inclined to use this, but I got for enough to at least try and document to some extent

Next up

Ansible!






