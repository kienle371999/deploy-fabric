#!/bin/bash

PROJECT=${1:-test}
CONFIG_FILE=${2:-config-templates/values.yaml}

mydir=$(dirname "$0")

echo "Creating configuration files for project $PROJECT"

cd $mydir/

PROJECT_FOLDER=$PWD/networks/$PROJECT

mkdir -p $PROJECT_FOLDER

cd fabric-kube

echo "Creating channel..."
helm template channel-flow/ -f $PROJECT_FOLDER/network.yaml -f $PROJECT_FOLDER/crypto-config.yaml -f $PROJECT_FOLDER/hostAliases.yaml | argo submit - --log --serviceaccount workflow
