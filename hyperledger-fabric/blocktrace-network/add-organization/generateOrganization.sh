export PATH=${PWD}/../../bin:${PWD}:$PATH
export FABRIC_CFG_PATH=${PWD}
export VERBOSE=false

source scriptUtils.sh

# Create Organziation crypto material using cryptogen or CAs
function generateOrg() {
  # Create crypto material using Fabric CAs
  if [ "$CRYPTO" == "Certificate Authorities" ]; then

    fabric-ca-client version > /dev/null 2>&1
    if [[ $? -ne 0 ]]; then
      echo "ERROR! fabric-ca-client binary not found.."
      echo
      echo "Follow the instructions in the Fabric docs to install the Fabric Binaries:"
      echo "https://hyperledger-fabric.readthedocs.io/en/latest/install.html"
      exit 1
    fi

    echo
    echo "##########################################################"
    echo "##### Generate certificates using Fabric CA's ############"
    echo "##########################################################"
     
    set -x
    IMAGE_TAG=${CA_IMAGETAG} docker-compose -f $COMPOSE_FILE_CA_ORG up -d 2>&1
    res=$?
    { set +x; } 2>/dev/null

    . fabric-ca/registerEnroll.sh

    sleep 10

    echo "##########################################################"
    echo "############ Create Org Identities ######################"
    echo "##########################################################"

    createOrg ${ORG_NAME} ${CA_ORG_PORT}

  fi

  echo
  echo "Generate CCP files for Org"
  ./ccp-generate.sh ${ORG_NAME_UPPER} ${ORG_PORT} ${CA_ORG_PORT}
}

# Generate channel configuration transaction
function generateOrgDefinition() {
  which configtxgen
  if [ "$?" -ne 0 ]; then
    echo "configtxgen tool not found. exiting"
    exit 1
  fi
  echo "##########################################################"
  echo "#######  Generating Org organization definition #########"
  echo "##########################################################"
   export FABRIC_CFG_PATH=$PWD/configtx/${ORG_NAME}
   set -x
   configtxgen -printOrg ${ORG_NAME_UPPER}MSP > ../organizations/peerOrganizations/${ORG_NAME}.blocktrace.com/${ORG_NAME}.json
   res=$?
   { set +x; } 2>/dev/null
   if [ $res -ne 0 ]; then
     echo "Failed to generate Org3 config material..."
     exit 1
   fi
  echo
}

function OrgUp () {
  # start networks
  if [ "${DATABASE}" == "couchdb" ]; then
    IMAGE_TAG=${IMAGETAG} docker-compose -f $COMPOSE_FILE_ORG -f $COMPOSE_FILE_COUCH_ORG up -d 2>&1
  else
    IMAGE_TAG=$IMAGETAG docker-compose -f $COMPOSE_FILE_ORG up -d 2>&1
  fi
  if [ $? -ne 0 ]; then
    echo "ERROR !!!! Unable to start Org network"
    exit 1
  fi
}

# Generate the needed certificates, the genesis block and start the network.
function addOrg () {

  # If the test network is not up, abort
  if [ ! -d ../organizations/ordererOrganizations ]; then
    echo
    echo "ERROR: Please, run ./network.sh up createChannel first."
    echo
    exit 1
  fi

  # generate artifacts if they don't exist
  if [ ! -d "../organizations/peerOrganizations/peer0.${ORG_NAME}.blocktrace.com" ]; then
    generateOrg 
    generateOrgDefinition
  fi

  CONTAINER_IDS=$(docker ps -a | awk '($2 ~ /fabric-tools/) {print $1}')
  if [ -z "$CONTAINER_IDS" -o "$CONTAINER_IDS" == " " ]; then
    echo "Bringing up network"
    OrgUp 
  fi

  # Use the CLI container to create the configuration transaction needed to add
  # Org to the network 
  echo  
  echo "###############################################################"
  echo "####### Generate and submit config tx to add Org #############"
  echo "###############################################################"
  docker exec ${ORG_NAME_UPPER}cli ./scripts/org-scripts/step1Org.sh $CHANNEL_NAME $ORG_NAME_UPPER $ORG_PORT $ORG1_PORT $ORG2_PORT $ORDER_PORT $ORGANIZATIONS
  if [ $? -ne 0 ]; then
    echo "ERROR !!!! Unable to create config tx"
    exit 1 
  fi

  echo
  echo "###############################################################"
  echo "############### Have Org peers join network ##################"
  echo "###############################################################"
  docker exec ${ORG_NAME_UPPER}cli ./scripts/org-scripts/step2Org.sh $CHANNEL_NAME $ORG_NAME_UPPER $ORG_PORT $ORG1_PORT $ORG2_PORT $ORDER_PORT
  if [ $? -ne 0 ]; then
    echo "ERROR !!!! Unable to have Org peers join network"
    exit 1
  fi 

}

# Tear down running network
function networkDown () {
    cd ..
    ./network.sh down
}

# Parse mode
if [[ $# -lt 1 ]] ; then
  exit 0
else
  MODE=$1
  shift
fi

# Parse commandline args
while [[ $# -ge 1 ]] ; do
  key="$1"
  case $key in
  -params )
    ORG_NAME_UPPER="$2"
    ORG_PORT="$3"
    ORG_CHAINCODE_LISTEN="$4"
    CA_ORG_PORT="$5"
    COUCHDB_NAME="$6"
    COUCHDB_PORT="$7"
    ORGANIZATIONS=(org1 org2)
    ORG_NAME=$(echo "$ORG_NAME_UPPER" | tr [:upper:] [:lower:])
    shift
    ;;
  esac
  shift
done

OS_ARCH=$(echo "$(uname -s|tr '[:upper:]' '[:lower:]'|sed 's/mingw64_nt.*/windows/')-$(uname -m | sed 's/x86_64/amd64/g')" | awk '{print tolower($0)}')
CRYPTO="Certificate Authorities"

CLI_TIMEOUT=10
CLI_DELAY=3
COMPOSE_FILE_COUCH_ORG=docker/${ORG_NAME}/docker-compose-couch.yaml
COMPOSE_FILE_ORG=docker/${ORG_NAME}/docker-compose-blocktrace-net.yaml
COMPOSE_FILE_CA_ORG=docker/${ORG_NAME}/docker-compose-ca.yaml
IMAGETAG="latest"
CA_IMAGETAG="latest"
DATABASE="couchdb"

# Determine whether starting, stopping, restarting or generating for announce
if [ "$MODE" == "up" ]; then
  echo "Add Org to channel '${CHANNEL_NAME}' with '${CLI_TIMEOUT}' seconds and CLI delay of '${CLI_DELAY}' seconds and using database '${DATABASE}'"
  echo
elif [ "$MODE" == "down" ]; then
  EXPMODE="Stopping network"
elif [ "$MODE" == "generate" ]; then
  EXPMODE="Generating certs and organization definition for Org"
else
  exit 1
fi

#Create the network using docker compose
if [ "${MODE}" == "up" ]; then
  ./generateConfig.sh ${ORG_NAME_UPPER} ${ORG_PORT} ${ORG_CHAINCODE_LISTEN} ${CA_ORG_PORT} ${COUCHDB_NAME} ${COUCHDB_PORT} ${CA_NAME}
  addOrg
elif [ "${MODE}" == "down" ]; then ## Clear the network
  networkDown
elif [ "${MODE}" == "generate" ]; then ## Generate Artifacts
  generateOrg
  generateOrgDefinition
else
  printHelp
  exit 1
fi
