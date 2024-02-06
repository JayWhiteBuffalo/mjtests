#!/bin/sh

cd /var/www

echo building app
npm run build

echo starting server
pm2 start serve -- -s build
