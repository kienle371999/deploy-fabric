#!/bin/bash

docker rm -f -v deploy_fabric_db
docker run -d -p 30000:27017 --name deploy_fabric_db mongo
node initDB
