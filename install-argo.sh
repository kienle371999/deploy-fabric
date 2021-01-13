#!/bin/bash

kubectl create namespace argo
kubectl apply -n argo -f https://raw.githubusercontent.com/argoproj/argo/stable/manifests/install.yaml

# create the service account
kubectl apply -f workflow-role.yaml