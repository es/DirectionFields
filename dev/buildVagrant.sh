#!/usr/bin/env bash
apt-get update
apt-get install -y nginx vim make g++ git-core
locale-gen en_CA.UTF-8

# Setting up Node.js
#wget http://nodejs.org/dist/v0.10.24/node-v0.10.24.tar.gz
#tar -xvf node-v0.10.24.tar.gz
#rm node-v0.10.24.tar.gz
#cd node-v0.10.24/
#./configure
#make
#make install
#cd ..

# Setting up nginx
cp /vagrant/dev/nginxConfig /etc/nginx/sites-enabled/
service nginx restart
