#!/bin/sh

echo installing dependencies
sudo yum update
sudo yum install -y npm

cd /var/www
npm install

sudo npm install -g serve pm2
