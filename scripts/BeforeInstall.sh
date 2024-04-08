#!/bin/sh

echo installing dependencies
sudo yum update
sudo yum install -y npm
sudo npm install -g pm2 pnpm

cd /var/www
pnpm install
