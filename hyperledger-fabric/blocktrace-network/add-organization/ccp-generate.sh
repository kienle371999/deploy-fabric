#!/bin/bash
source scriptUtils.sh

ORG_NAME_UPPER="$1"
ORG_PORT="$2"
CA_ORG_PORT="$3"
ORG_NAME=$(echo "$ORG_NAME_UPPER" | tr [:upper:] [:lower:])

function one_line_pem {
    echo "`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' $1`"
}

function json_ccp {
    local PP=$(one_line_pem $5)
    local CP=$(one_line_pem $6)
    sed -e "s/\${ORG_NAME_UPPER}/$1/" \
        -e "s/\${ORG_NAME}/$2/" \
        -e "s/\${P0PORT}/$3/" \
        -e "s/\${CAPORT}/$4/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        ccp-template.json
}

function yaml_ccp {
    local PP=$(one_line_pem $5)
    local CP=$(one_line_pem $6)
    sed -e "s/\${ORG_NAME_UPPER}/$1/" \
        -e "s/\${ORG_NAME}/$2/" \
        -e "s/\${P0PORT}/$3/" \
        -e "s/\${CAPORT}/$4/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        ccp-template.yaml | sed -e $'s/\\\\n/\\\n          /g'
}

P0PORT=${ORG_PORT}
CAPORT=${CA_ORG_PORT}
PEERPEM=../organizations/peerOrganizations/${ORG_NAME}.blocktrace.com/tlsca/tlsca.${ORG_NAME}.blocktrace.com-cert.pem
CAPEM=../organizations/peerOrganizations/${ORG_NAME}.blocktrace.com/ca/ca.${ORG_NAME}.blocktrace.com-cert.pem

echo "$(json_ccp $ORG_NAME_UPPER $ORG_NAME $P0PORT $CAPORT $PEERPEM $CAPEM)" > ../organizations/peerOrganizations/${ORG_NAME}.blocktrace.com/connection-${ORG_NAME}.json
echo "$(yaml_ccp $ORG_NAME_UPPER $ORG_NAME $P0PORT $CAPORT $PEERPEM $CAPEM)" > ../organizations/peerOrganizations/${ORG_NAME}.blocktrace.com/connection-${ORG_NAME}.yaml
