#!/bin/bash

PROJECT=${1:-test}

mydir=$(dirname "$0")

cd $mydir/

PROJECT_FOLDER=$PWD/networks/$PROJECT

# mkdir -p $PROJECT_FOLDER

cd fabric-kube

echo "Creating channel..."
# helm template channel-flow/ -s templates/channel-workflow.yaml -f $PROJECT_FOLDER/network.yaml -f $PROJECT_FOLDER/crypto-config.yaml  | sed -n '1!p' > $PROJECT_FOLDER/ca222.yaml 
helm template channel-flow/ -f $PROJECT_FOLDER/network.yaml -f $PROJECT_FOLDER/crypto-config.yaml -f $PROJECT_FOLDER/hostAliases.yaml | argo submit - --log --serviceaccount workflow