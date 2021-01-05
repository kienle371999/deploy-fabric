source scriptUtils.sh

ORG_NAME_UPPER="$1"
ORG_PORT="$2"
ORG_CHAINCODE_LISTEN="$3"
CA_ORG_PORT="$4"
COUCHDB_NAME="$5"
COUCHDB_PORT="$6"
CA_NAME="$7"

ORG_NAME=$(echo "$ORG_NAME_UPPER" | tr [:upper:] [:lower:])

function yaml_blocktrace_template {
    sed -e "s/\${ORG_NAME_UPPER}/$1/g" \
        -e "s/\${ORG_NAME}/$2/g" \
        -e "s/\${ORG_PORT}/$3/g" \
        -e "s/\${ORG_CHAINCODE_LISTEN}/$4/g" \
        docker/docker-compose-blocktrace-template.yaml | sed -e $'s/\\\\n/\\\n          /g'
}

function yaml_ca_template {
    sed -e "s/\${ORG_NAME}/$1/g" \
        -e "s/\${CA_ORG_PORT}/$2/g" \
        docker/docker-compose-ca-template.yaml | sed -e $'s/\\\\n/\\\n          /g'
}

function yaml_couch_template {
    sed -e "s/\${ORG_NAME}/$1/g" \
        -e "s/\${COUCHDB_NAME}/$2/g" \
        -e "s/\${COUCHDB_PORT}/$3/g" \
        docker/docker-compose-couch-template.yaml | sed -e $'s/\\\\n/\\\n          /g'
}

function yaml_configtx_template {
    sed -e "s/\${ORG_NAME_UPPER}/$1/g" \
        -e "s/\${ORG_NAME}/$2/g" \
        -e "s/\${ORG_PORT}/$3/g" \
        configtx/configtx-template.yaml | sed -e $'s/\\\\n/\\\n          /g'
}

mkdir -p fabric-ca/${ORG_NAME}
cp server-config/fabric-ca-server-config.yaml fabric-ca/${ORG_NAME}/fabric-ca-server-config.yaml

mkdir -p docker/${ORG_NAME}
echo "$(yaml_blocktrace_template ${ORG_NAME_UPPER} ${ORG_NAME} ${ORG_PORT} ${ORG_CHAINCODE_LISTEN})" > docker/${ORG_NAME}/docker-compose-blocktrace-net.yaml
echo "$(yaml_ca_template ${ORG_NAME} ${CA_ORG_PORT})" > docker/${ORG_NAME}/docker-compose-ca.yaml
echo "$(yaml_couch_template ${ORG_NAME} ${COUCHDB_NAME} ${COUCHDB_PORT})" > docker/${ORG_NAME}/docker-compose-couch.yaml

mkdir -p configtx/${ORG_NAME}
echo "$(yaml_configtx_template ${ORG_NAME_UPPER} ${ORG_NAME} ${ORG_PORT})" > configtx/${ORG_NAME}/configtx.yaml


