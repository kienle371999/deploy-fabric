#!/bin/bash

PROJECT=${1:-test}
CONFIG_FILE=${2:-config-templates/values.yaml}
CHANNEL_CONFIG_FILE=${2:-channel-templates/values.yaml}

mydir=$(dirname "$0")

cd $mydir/

PROJECT_FOLDER=$PWD/networks/$PROJECT

mkdir -p $PROJECT_FOLDER

cd fabric-kube

helm template channel-templates/ -s templates/configtx.yaml -f $CONFIG_FILE -f $CHANNEL_CONFIG_FILE | sed -n '1!p' > $PROJECT_FOLDER/configtx.yaml
helm template channel-templates/ -s templates/channel-config.yaml -f $CHANNEL_CONFIG_FILE | sed -n '1!p'  > $PROJECT_FOLDER/channel-config.yaml

echo "Creating channel..."
# helm template channel-flow/ -s templates/channel-workflow.yaml -f $PROJECT_FOLDER/network.yaml -f $PROJECT_FOLDER/crypto-config.yaml  | sed -n '1!p' > $PROJECT_FOLDER/ca222.yaml 
helm template channel-flow/ -f $PROJECT_FOLDER/network.yaml -f $PROJECT_FOLDER/channel-config.yaml -f $PROJECT_FOLDER/channel-config.yaml -f $PROJECT_FOLDER/crypto-config.yaml -f $PROJECT_FOLDER/hostAliases.yaml | argo submit - --log --serviceaccount workflow
