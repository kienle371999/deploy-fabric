#!/bin/bash
#
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
#

# This script is designed to be run in the org3cli container as the
# first step of the EYFN tutorial.  It creates and submits a
# configuration transaction to add org3 to the test network
#

CHANNEL_NAME="$1"
ORG_NAME_UPPER="$2"
ORG_PORT="$3"
ORG1_PORT="$4"
ORG2_PORT="$5"
ORDER_PORT="$6"
ORGANIZATIONS="$7"
COUNTER=1
MAX_RETRY=5
DELAY=3
TIMEOUT=10
VERBOSE=false

ORG_NAME=$(echo "$ORG_NAME_UPPER" | tr [:upper:] [:lower:])


# import environment variables
. scripts/org-scripts/envVarCLI.sh ${ORG_NAME_UPPER} ${ORG_PORT} ${ORG1_PORT} ${ORG2_PORT}


# fetchChannelConfig <channel_id> <output_json>
# Writes the current channel config for a given channel to a JSON file
fetchChannelConfig() {
  ORG=$1
  CHANNEL=$2
  ORDER_PORT=$3
  OUTPUT=$4
  
  setOrdererGlobals

  setGlobals $ORG

  echo "Fetching the most recent configuration block for the channel"
  set -x
  peer channel fetch config config_block.pb -o orderer.blocktrace.com:${ORDER_PORT} --ordererTLSHostnameOverride orderer.blocktrace.com -c $CHANNEL --tls --cafile $ORDERER_CA
  { set +x; } 2>/dev/null

  echo "Decoding config block to JSON and isolating config to ${OUTPUT}"
  set -x
  configtxlator proto_decode --input config_block.pb --type common.Block | jq .data.data[0].payload.data.config >"${OUTPUT}"
  { set +x; } 2>/dev/null
}

# createConfigUpdate <channel_id> <original_config.json> <modified_config.json> <output.pb>
# Takes an original and modified config, and produces the config update tx
# which transitions between the two
createConfigUpdate() {
  CHANNEL_NAME=$1
  ORIGINAL=$2
  MODIFIED=$3
  OUTPUT=$4

  set -x
  configtxlator proto_encode --input "${ORIGINAL}" --type common.Config >original_config.pb
  configtxlator proto_encode --input "${MODIFIED}" --type common.Config >modified_config.pb
  configtxlator compute_update --channel_id "${CHANNEL_NAME}" --original original_config.pb --updated modified_config.pb >config_update.pb
  configtxlator proto_decode --input config_update.pb --type common.ConfigUpdate >config_update.json
  echo '{"payload":{"header":{"channel_header":{"channel_id":"'${CHANNEL_NAME}'", "type":2}},"data":{"config_update":'$(cat config_update.json)'}}}' | jq . >config_update_in_envelope.json
  configtxlator proto_encode --input config_update_in_envelope.json --type common.Envelope >"${OUTPUT}"
  { set +x; } 2>/dev/null
}

# signConfigtxAsPeerOrg <org> <configtx.pb>
# Set the peerOrg admin of an org and signing the config update
signConfigtxAsPeerOrg() {
  . scripts/org-scripts/envVarCLI.sh $1 ${ORG_PORT} ${ORG1_PORT} ${ORG2_PORT}

  PEERORG=$(echo "$1" | tr [:upper:] [:lower:])
  TX=$2
  setGlobals $PEERORG
  set -x
  peer channel signconfigtx -f "${TX}"
  { set +x; } 2>/dev/null
}

echo
echo "========= Creating config transaction to add org to network =========== "
echo

# Fetch the config for the channel, writing it to config.json
fetchChannelConfig org1 ${CHANNEL_NAME} ${ORDER_PORT} config.json

# Modify the configuration to append the new org
set -x
jq -s '.[0] * {"channel_group":{"groups":{"Application":{"groups": {"'${ORG_NAME_UPPER}MSP'":.[1]}}}}}' config.json ./organizations/peerOrganizations/${ORG_NAME}.blocktrace.com/${ORG_NAME}.json > modified_config.json
{ set +x; } 2>/dev/null

# Compute a config update, based on the differences between config.json and modified_config.json, write it as a transaction to org3_update_in_envelope.pb
createConfigUpdate ${CHANNEL_NAME} config.json modified_config.json org_update_in_envelope.pb

echo
echo "========= Config transaction to add org3 to network created ===== "
echo

echo "Signing config transaction"

# echo loop function 
i=1
until [ $i -gt $ORGANIZATIONS ]
do
  organization=Org$i
  echo "iiiii $organization"
  signConfigtxAsPeerOrg $organization org_update_in_envelope.pb
  i=`expr $i + 1` 
done

echo
echo "========= Submitting transaction from ORG1 ========= "
echo
setGlobals org1
set -x
peer channel update -f org_update_in_envelope.pb -c ${CHANNEL_NAME} -o orderer.blocktrace.com:${ORDER_PORT} --ordererTLSHostnameOverride orderer.blocktrace.com --tls --cafile ${ORDERER_CA}
{ set +x; } 2>/dev/null

echo
echo "========= Config transaction to add org to network submitted! =========== "
echo

exit 0
