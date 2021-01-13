#!/bin/bash

if test "$#" -ne 2; then
   echo "usage: init.sh <project_folder> <chaincode_folder>"
   exit 2
fi

# exit when any command fails
set -e

project_folder=$1
chaincode_folder=$2

config_file=$project_folder/network.yaml

rm -rf chaincodes
mkdir -p chaincodes

chaincodes=$(yq ".network.chaincodes[].name" $config_file -c -r)
for chaincode in $chaincodes; do
  echo "creating chaincodes/$chaincode.tar"
  
  tar -czf chaincodes/$chaincode.tar -C $chaincode_folder $chaincode/
  aws s3 cp chaincodes/$chaincode.tar s3://sota-console-test/$chaincode.tar
done

