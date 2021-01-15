#!/bin/bash

PROJECT=${1:-test}
CONFIG_FILE=${2:-config-templates/values.yaml}

mydir=$(dirname "$0")

echo "Creating configuration files for project $PROJECT"

cd $mydir/

PROJECT_FOLDER=$PWD/networks/$PROJECT

mkdir -p $PROJECT_FOLDER

cd fabric-kube

helm template config-templates/ -s templates/configtx.yaml -f $CONFIG_FILE | sed -n '1!p' > $PROJECT_FOLDER/configtx.yaml
helm template config-templates/ -s templates/crypto-config.yaml -f $CONFIG_FILE | sed -n '1!p' > $PROJECT_FOLDER/crypto-config.yaml
helm template config-templates/ -s templates/network.yaml -f $CONFIG_FILE | sed -n '1!p'  > $PROJECT_FOLDER/network.yaml

./init.sh $PROJECT_FOLDER/ 

echo "Start creating network..."
helm install $PROJECT ./hlf-kube -f $PROJECT_FOLDER/network.yaml -f $PROJECT_FOLDER/crypto-config.yaml --wait
./collect_host_aliases.sh $PROJECT_FOLDER/
echo "Updating host aliases..."
helm upgrade $PROJECT ./hlf-kube -f $PROJECT_FOLDER/network.yaml -f $PROJECT_FOLDER/crypto-config.yaml -f $PROJECT_FOLDER/hostAliases.yaml --wait

echo "Creating channel..."
helm template channel-flow/ -f $PROJECT_FOLDER/network.yaml -f $PROJECT_FOLDER/crypto-config.yaml -f $PROJECT_FOLDER/hostAliases.yaml | argo submit - --log --serviceaccount workflow

echo "Preparing chaincode..."
./prepare_chaincodes.sh $PROJECT_FOLDER ./samples/chaincode/

echo "Installing chaincode..."
helm template chaincode-flow/ -f $PROJECT_FOLDER/network.yaml -f $PROJECT_FOLDER/crypto-config.yaml -f $PROJECT_FOLDER/hostAliases.yaml | argo submit - --log --serviceaccount workflow