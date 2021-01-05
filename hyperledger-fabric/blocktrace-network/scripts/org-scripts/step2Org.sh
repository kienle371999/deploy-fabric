#!/bin/bash
#
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
#

# This script is designed to be run in the org3cli container as the
# second step of the EYFN tutorial. It joins the org3 peers to the
# channel previously setup in the BYFN tutorial and install the
# chaincode as version 2.0 on peer0.org3.
#

echo
echo "========= Getting Org on to your test network ========= "
echo
CHANNEL_NAME="$1"
ORG_NAME_UPPER="$2"
ORG_PORT="$3"
ORG1_PORT="$4"
ORG2_PORT="$5"
ORDER_PORT="$6"
COUNTER=1
MAX_RETRY=5
DELAY=3
TIMEOUT=10
VERBOSE=false

ORG_NAME=$(echo "$ORG_NAME_UPPER" | tr [:upper:] [:lower:])

# import environment variables
. scripts/org-scripts/envVarCLI.sh ${ORG_NAME_UPPER} ${ORG_PORT} ${ORG1_PORT} ${ORG2_PORT}

## Sometimes Join takes time hence RETRY at least 5 times
joinChannelWithRetry() {
  ORG=$1
  setGlobals $ORG

  set -x
  peer channel join -b $CHANNEL_NAME.block >&log.txt
  res=$?
  { set +x; } 2>/dev/null
  cat log.txt
  if [ $res -ne 0 -a $COUNTER -lt $MAX_RETRY ]; then
    COUNTER=$(expr $COUNTER + 1)
    echo "peer0.${ORG_NAME} failed to join the channel, Retry after $DELAY seconds"
    sleep $DELAY
    joinChannelWithRetry $ORG
  else
    COUNTER=1
  fi
  verifyResult $res "After $MAX_RETRY attempts, peer0.${ORG_NAME} has failed to join channel '$CHANNEL_NAME' "
}


echo "Fetching channel config block from orderer..."
set -x
peer channel fetch 0 $CHANNEL_NAME.block -o orderer.blocktrace.com:${ORDER_PORT} --ordererTLSHostnameOverride orderer.blocktrace.com -c $CHANNEL_NAME --tls --cafile $ORDERER_CA >&log.txt
res=$?
{ set +x; } 2>/dev/null
cat log.txt
verifyResult $res "Fetching config block from orderer has Failed"

joinChannelWithRetry ${ORG_NAME}
echo "===================== peer0.${ORG_NAME} joined channel '$CHANNEL_NAME' ===================== "

echo
echo "========= Finished adding Org to your test network! ========= "
echo

exit 0
