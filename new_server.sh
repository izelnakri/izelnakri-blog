#!/usr/bin/env bash

export LANGUAGE=en_US.UTF-8
export LC_ALL=en_US.UTF-8
export LANG=en_US.UTF-8
export LC_TYPE=en_US.UTF-8
sudo vi /etc/environment # LC_ALL="en_US.UTF-8"

adduser izelnakri

apt-get update
apt-get install sudo

usermod -a -G sudo izelnakri

mkdir .ssh
chmod 700 .ssh
vi .ssh/authorized_keys # copy paste key

chmod 600 .ssh/authorized_keys # restrict keys

/etc/ssh/sshd_config # change PermitRootLogin to no

systemctl restart ssh # restart ssh

## FROM LOCAL:
scp .example_profile 95.85.25.86:~/.bashrc # adding colors to the terminal

sudo apt-get install postgresql postgresql-contrib

createuser izelnakri -p

# config db maybe..

# install nginx
sudo apt-get install nginx

sudo mkdir -p "/var/www" && sudo chown -R izelnakri "/var/www"

# install git
sudo apt-get install git

# install elixir
sudo wget https://packages.erlang-solutions.com/erlang-solutions_1.0_all.deb && sudo dpkg -i erlang-solutions_1.0_all.deb
sudo apt-get update
sudo apt-get install esl-erlang
sudo apt-get install elixir

# install nodejs
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs

sudo apt-get install -y build-essential

sudo npm install npm@latest -g
sudo npm install bower -g

# install emberjs
sudo npm install ember-cli -g
sudo npm install fastboot-app-server -g
