#!/bin/bash
PROJECT=${1:-test}
EXPLORER_FILE=${2:-hlf-kube/values.explorer.yaml}

mydir=$(dirname "$0")

echo "Install hyperledger explorer for project $PROJECT"

cd $mydir/
PROJECT_FOLDER=$PWD/networks/$PROJECT

cd fabric-kube

kubectl cp explorer-config/ fabric-tools:/fabric-storage/


echo "Configure postgress DB..."
db_pod=$(kubectl get pods | grep blockchain-explorer-db | awk '{print $1}')
kubectl exec -it $db_pod -- sh -c "chmod +x /fabric-storage/explorer-config/init-explorer-db.sh && /fabric-storage/explorer-config/init-explorer-db.sh"

echo "Instantiate Hyperledger Explorer..."
helm upgrade $PROJECT ./hlf-kube -f $PROJECT_FOLDER/network.yaml -f $PROJECT_FOLDER/crypto-config.yaml -f $PROJECT_FOLDER/hostAliases.yaml -f $PROJECT_FOLDER/chaincode-config.yaml -f $EXPLORER_FILE --wait