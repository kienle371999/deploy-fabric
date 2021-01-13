#!/bin/bash

docker rm -f -v sota_console_db
docker run -d -p 27017-27019:27017-27019 --name sota_console_db mongo
node initDB
