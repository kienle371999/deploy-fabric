#!/bin/bash

PROJECT=${1:-test}

helm uninstall $PROJECT
argo delete --all