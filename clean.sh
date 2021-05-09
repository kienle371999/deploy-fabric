#!/bin/bash

if [ "$(helm  list -aq)" != "" ]; then 
    helm del $(helm ls --all --short)
    argo delete --all
fi

rm -rf $PWD/fabric-kube/hlf-kube/values.yaml