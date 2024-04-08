#!/bin/sh

echo installing dependencies
sudo yum update
sudo yum install -y npm
sudo npm install -g npm@latest pnpm
sudo pnpm install -g pm2

cd /var/www
pnpm install
pnpx prisma generate
