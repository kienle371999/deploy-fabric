#!/bin/bash

PROJECT=${1:-test}
CONFIG_FILE=${2:-config-templates/chaincode-values.yaml}

mydir=$(dirname "$0")

echo "Creating configuration files for project $PROJECT"

cd $mydir/
PROJECT_FOLDER=$PWD/networks/$PROJECT

cd fabric-kube

helm template config-templates/ -s templates/chaincode-config.yaml -f $CONFIG_FILE | sed -n '1!p' > $PROJECT_FOLDER/chaincode-config.yaml

echo "Preparing chaincode..."
./prepare_chaincodes.sh $PROJECT_FOLDER ./samples/chaincode/

echo "Installing chaincode..."
helm upgrade $PROJECT ./hlf-kube -f $PROJECT_FOLDER/network.yaml -f $PROJECT_FOLDER/crypto-config.yaml -f $PROJECT_FOLDER/hostAliases.yaml -f $PROJECT_FOLDER/chaincode-config.yaml  --values=$PROJECT_FOLDER/hlf-kube-value.yaml --wait 
helm template chaincode-flow/ -f $PROJECT_FOLDER/crypto-config.yaml -f $PROJECT_FOLDER/hostAliases.yaml -f $PROJECT_FOLDER/chaincode-config.yaml | argo submit - --log --serviceaccount workflow