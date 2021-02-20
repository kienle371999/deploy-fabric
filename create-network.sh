#!/bin/bash

PROJECT=${1:-test}
CONFIG_FILE=${2:-config-templates/values.yaml}

mydir=$(dirname "$0")

echo "Creating configuration files for project $PROJECT"

cd $mydir/

# Remove unnecessity 
./clean.sh $PROJECT

# Create new namspace
kubectl create namespace "$PROJECT-namespace"

PROJECT_FOLDER=$PWD/networks/$PROJECT

mkdir -p $PROJECT_FOLDER

cd fabric-kube

helm template config-templates/ -s templates/crypto-config.yaml -f $CONFIG_FILE | sed -n '1!p' > $PROJECT_FOLDER/crypto-config.yaml
helm template config-templates/ -s templates/hlf-kube-value.yaml -f $CONFIG_FILE | sed -n '1!p'  > $PROJECT_FOLDER/hlf-kube-value.yaml
helm template config-templates/ -s templates/network.yaml | sed -n '1!p'  > $PROJECT_FOLDER/network.yaml

echo "Start creating network..."
# helm template hlf-kube/ -s templates/ca-deployment.yaml -f $PROJECT_FOLDER/network.yaml -f $PROJECT_FOLDER/crypto-config.yaml --values=$PROJECT_FOLDER/hlf-kube-value.yaml  | sed -n '1!p' > $PROJECT_FOLDER/ca222.yaml 

helm install $PROJECT ./hlf-kube -f $PROJECT_FOLDER/network.yaml -f $PROJECT_FOLDER/crypto-config.yaml --values=$PROJECT_FOLDER/hlf-kube-value.yaml -n "$PROJECT-namespace" --wait 
./collect_host_aliases.sh $PROJECT_FOLDER/
echo "Updating host aliases..."
helm upgrade $PROJECT ./hlf-kube -f $PROJECT_FOLDER/network.yaml -f $PROJECT_FOLDER/crypto-config.yaml -f $PROJECT_FOLDER/hostAliases.yaml -n "$PROJECT-namespace" --values=$PROJECT_FOLDER/hlf-kube-value.yaml --wait 
