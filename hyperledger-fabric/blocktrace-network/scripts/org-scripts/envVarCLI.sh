# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#

# This is a collection of bash functions used by different scripts
ORG_NAME_UPPER="$1"
ORG_PORT="$2"
ORG1_PORT="$3"
ORG2_PORT="$4"

ORG_NAME=$(echo "$ORG_NAME_UPPER" | tr [:upper:] [:lower:])

ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/ordererOrganizations/blocktrace.com/orderers/orderer.blocktrace.com/msp/tlscacerts/tlsca.blocktrace.com-cert.pem
PEER0_ORG_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/peerOrganizations/${ORG_NAME}.blocktrace.com/peers/peer0.${ORG_NAME}.blocktrace.com/tls/ca.crt

# Set OrdererOrg.Admin globals
setOrdererGlobals() {
  CORE_PEER_LOCALMSPID="OrdererMSP"
  CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/ordererOrganizations/blocktrace.com/orderers/orderer.blocktrace.com/msp/tlscacerts/tlsca.blocktrace.com-cert.pem
  CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/ordererOrganizations/blocktrace.com/users/Admin@blocktrace.com/msp
}

# Set environment variables for the peer org
setGlobals() {
  ORG=$1
  if [ "$ORG" = "$ORG_NAME" ]; then
    CORE_PEER_LOCALMSPID="${ORG_NAME_UPPER}MSP"
    CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_ORG_CA
    CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/peerOrganizations/${ORG_NAME}.blocktrace.com/users/Admin@${ORG_NAME}.blocktrace.com/msp
    CORE_PEER_ADDRESS=peer0.${ORG_NAME}.blocktrace.com:${ORG_PORT}
  else
    echo "================== ERROR !!! ORG Unknown =================="
  fi

  if [ "$VERBOSE" == "true" ]; then
    env | grep CORE
  fi
}

# parsePeerConnectionParameters $@
# Helper function that sets the peer connection parameters for a chaincode
# operation
parsePeerConnectionParameters() {

  PEER_CONN_PARMS=""
  PEERS=""
  while [ "$#" -gt 0 ]; do
    setGlobals $1
    PEER="peer0.org$1"
    ## Set peer addresses
    PEERS="$PEERS $PEER"
    PEER_CONN_PARMS="$PEER_CONN_PARMS --peerAddresses $CORE_PEER_ADDRESS"
    ## Set path to TLS certificate
    TLSINFO=$(eval echo "--tlsRootCertFiles \$PEER0_ORG_CA")
    PEER_CONN_PARMS="$PEER_CONN_PARMS $TLSINFO"
    # shift by one to get to the next organization
    shift
  done
  # remove leading space for output
  PEERS="$(echo -e "$PEERS" | sed -e 's/^[[:space:]]*//')"
}

verifyResult() {
  if [ $1 -ne 0 ]; then
    echo $'\e[1;31m'!!!!!!!!!!!!!!! $2 !!!!!!!!!!!!!!!!$'\e[0m'
    echo
    exit 1
  fi
}
