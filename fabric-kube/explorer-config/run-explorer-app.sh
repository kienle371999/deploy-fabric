#!/bin/sh
mkdir -p /opt/explorer/app/platform/fabric/
mkdir -p /tmp/

cp /fabric-storage/explorer-config/config.json /opt/explorer/app/platform/fabric/connection-profile/test-network.json

rm -rf wallet logs && ./start.sh
