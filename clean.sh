#!/bin/bash

PROJECT=${1:-test}

if [ "$(helm  list -aq)" != "" ]; then 
    helm uninstall $PROJECT
    argo delete --all
fi

rm -rf $PWD/fabric-kube/hlf-kube/values.yaml