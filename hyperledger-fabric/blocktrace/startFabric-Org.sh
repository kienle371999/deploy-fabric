#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error
set -e

# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1
starttime=$(date +%s)

ORG_NAME_UPPER=$1 ## adding in scripts later
ORG_PORT=$2
ORG_CHAINCODE_LISTEN="$3"
CA_ORG_PORT="$4"
COUCHDB_NAME="$5"
COUCHDB_PORT="$6"
ORGANIZATION="$7"
CC_SRC_LANGUAGE="javascript"
CC_SRC_BLOCKTRACE_PATH="../chaincode/blocktrace/"
CC_SRC_IDENTITY_PATH="../chaincode/identity/"

source '../blocktrace-network/scriptUtils.sh'

# clean out any old identites in the wallets
rm -rf javascript/wallet/*

# launch network; create channel and join peer to channel
pushd ../blocktrace-network/add-organization 

infoln "Bring up the network"
./network-Org.sh up -params $ORG_NAME_UPPER $ORG_PORT $ORG_CHAINCODE_LISTEN $CA_ORG_PORT $COUCHDB_NAME $COUCHDB_PORT $ORGANIZATION

infoln "Deploy Blocktrace Smart Contract"
./network-Org.sh packageCC -cco ${ORG_NAME_UPPER} ${ORG_PORT} -ccn blocktrace -ccv 1 -ccl ${CC_SRC_LANGUAGE} -ccp ${CC_SRC_BLOCKTRACE_PATH}
./network-Org.sh deployCC -cco ${ORG_NAME_UPPER} ${ORG_PORT} -ccn blocktrace -ccv 1 -ccl ${CC_SRC_LANGUAGE} -ccp ${CC_SRC_BLOCKTRACE_PATH}

infoln "Deploy Identity Smart Contract"
./network-Org.sh packageCC -cco ${ORG_NAME_UPPER} ${ORG_PORT} -ccn identity -ccv 1 -ccl ${CC_SRC_LANGUAGE} -ccp ${CC_SRC_BLOCKTRACE_PATH}
./network-Org.sh deployCC -cco ${ORG_NAME_UPPER} ${ORG_PORT} -ccn identity -ccv 1 -ccl ${CC_SRC_LANGUAGE} -ccp ${CC_SRC_IDENTITY_PATH}
popd

cat <<EOF

Total setup execution time : $(($(date +%s) - starttime)) secs ...

Next, use the Blocktrace applications to interact with the deployed Blocktrace contract.
The Blocktrace applications are available in Javascript programming languages.

EOF
