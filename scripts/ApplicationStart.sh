#!/bin/sh

cd /var/www

echo starting server
pm2 start --name "next" "npm run start"
