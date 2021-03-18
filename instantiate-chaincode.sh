#!/bin/bash

PROJECT=${1:-test}
CONFIG_FILE=${2:-config-templates/values.chaincodes.yaml}

mydir=$(dirname "$0")

echo "Creating configuration files for project $PROJECT"

cd $mydir/
PROJECT_FOLDER=$PWD/networks/$PROJECT

cd fabric-kube

kubectl cp explorer-config/ fabric-tools:/fabric-storage/

helm template config-templates/ -s templates/chaincode-config.yaml -f $CONFIG_FILE | sed -n '1!p' > $PROJECT_FOLDER/chaincode-config.yaml

echo "Preparing chaincode..."
./prepare_chaincodes.sh $PROJECT_FOLDER ./samples/chaincode/

echo "Installing chaincode..."
helm upgrade $PROJECT ./hlf-kube -f $PROJECT_FOLDER/network.yaml -f $PROJECT_FOLDER/crypto-config.yaml -f $PROJECT_FOLDER/hostAliases.yaml -f $PROJECT_FOLDER/chaincode-config.yaml --wait 
helm template chaincode-flow/ -f $PROJECT_FOLDER/crypto-config.yaml -f $PROJECT_FOLDER/hostAliases.yaml -f $PROJECT_FOLDER/chaincode-config.yaml | argo submit - --log --serviceaccount workflow


echo "Configure postgress DB..."
db_pod=$(kubectl get pods | grep blockchain-explorer-db | awk '{print $1}')
kubectl exec -it $db_pod -- sh -c "chmod +x /fabric-storage/explorer-config/init-explorer-db.sh && /fabric-storage/explorer-config/init-explorer-db.sh"

echo "Instantiate Hyperledger Explorer..."
helm upgrade $PROJECT ./hlf-kube -f $PROJECT_FOLDER/network.yaml -f $PROJECT_FOLDER/crypto-config.yaml -f $PROJECT_FOLDER/hostAliases.yaml -f $PROJECT_FOLDER/chaincode-config.yaml --set enabledPostgres=true --wait