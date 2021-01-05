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
CC_SRC_LANGUAGE="javascript"
CC_SRC_BLOCKHASH_PATH="../chaincode/blockhash/"


# CC_SRC_BLOCKTRACE_PATH="../chaincode/blocktrace/"
# CC_SRC_IDENTITY_PATH='../chaincode/identity/'

source '../blocktrace-network/scriptUtils.sh'

# clean out any old identites in the wallets
rm -rf javascript/wallet/*

# clean out configtx.yaml
rm -rf ../blocktrace-network/configtx/configtx.yaml

# launch network; create channel and join peer to channel
pushd ../blocktrace-network
./network.sh down
./network.sh up createChannel -ca -s couchdb

# infoln "Deploy Blocktrace Smart Contract"
# ./network.sh packageChaincode -ccn blocktrace -ccv 1 -ccl ${CC_SRC_LANGUAGE} -ccp ${CC_SRC_BLOCKTRACE_PATH}
# ./network.sh deployCC -ccn blocktrace -ccv 1 -ccl ${CC_SRC_LANGUAGE} -ccp ${CC_SRC_BLOCKTRACE_PATH}

# infoln "Deploy Identity Smart Contract"
# ./network.sh packageChaincode -ccn identity -ccv 1 -ccl ${CC_SRC_LANGUAGE} -ccp ${CC_SRC_IDENTITY_PATH}
# ./network.sh deployCC -ccn identity -ccv 1 -ccl ${CC_SRC_LANGUAGE} -ccp ${CC_SRC_IDENTITY_PATH}

infoln "Deploy BlockHash Smart Contract"
./network.sh packageChaincode -ccn blockhash -ccv 1 -ccl ${CC_SRC_LANGUAGE} -ccp ${CC_SRC_BLOCKHASH_PATH}
./network.sh deployCC -ccn blockhash -ccv 1 -ccl ${CC_SRC_LANGUAGE} -ccp ${CC_SRC_BLOCKHASH_PATH}
popd

cat <<EOF

Total setup execution time : $(($(date +%s) - starttime)) secs ...

Next, use the Blocktrace applications to interact with the deployed Blocktrace contract.
The Blocktrace applications are available in Javascript programming languages.

EOF
