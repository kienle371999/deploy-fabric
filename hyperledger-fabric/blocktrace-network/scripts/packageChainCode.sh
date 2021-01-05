#!/bin/bash

source scriptUtils.sh
. scripts/envVar.sh

CC_NAME=${1:-"basic"}
CC_SRC_PATH=${2:-"NA"}
CC_VERSION=${3:-"1.0"}
CC_RUNTIME_LANGUAGE=node
FABRIC_CFG_PATH=$PWD/../config/

packageChaincode() {
  ORG=$1
  setGlobals $ORG
  set -x
  peer lifecycle chaincode package ${CONTRACT_PATH}/${CC_NAME}.tar.gz --path ${CC_SRC_PATH} --lang ${CC_RUNTIME_LANGUAGE} --label ${CC_NAME}_${CC_VERSION} >&log.txt
  res=$?
  { set +x; } 2>/dev/null
  cat log.txt
  verifyResult $res "Chaincode packaging on peer0.org${ORG} has failed"
  successln "Chaincode is packaged on peer0.org${ORG}"
}

packageChaincode 1