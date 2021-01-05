#!/bin/bash

CC_NAME="$1"
CC_SRC_PATH="$2"
CC_VERSION="$3"
ORG_NAME_UPPER="$4"
ORG_PORT="$5"
ORG1_PORT="$6"
ORG2_PORT="$7"
ORDER_PORT="$8"
CONTRACT_PATH="$9"
CC_RUNTIME_LANGUAGE=node

ORG_NAME=$(echo "$ORG_NAME_UPPER" | tr [:upper:] [:lower:])

FABRIC_CFG_PATH=$PWD/config

# import environment variables 
. scripts/org-scripts/envVarCLI.sh ${ORG_NAME_UPPER} ${ORG_PORT} ${ORG1_PORT} ${ORG2_PORT}

packageChaincode() {
  ORG=$1
  setGlobals $ORG
  set -x
  peer lifecycle chaincode package ${CONTRACT_PATH}/${CC_NAME}.tar.gz --path ${CC_SRC_PATH} --lang ${CC_RUNTIME_LANGUAGE} --label ${CC_NAME}_${CC_VERSION} >&log.txt
  res=$?
  { set +x; } 2>/dev/null
  cat log.txt
  verifyResult $res "Chaincode packaging on peer0.${ORG} has failed"
  echo "Chaincode is packaged on peer0.${ORG}"
}

packageChaincode ${ORG_NAME}