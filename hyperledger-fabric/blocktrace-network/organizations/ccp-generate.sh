#!/bin/bash
source scriptUtils.sh

function one_line_pem {
    echo "`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' $1`"
}

function json_ccp {
    local PP=$(one_line_pem $4)
    local CP=$(one_line_pem $5)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${P0PORT}/$2/" \
        -e "s/\${CAPORT}/$3/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        organizations/ccp-template.json
}

function yaml_ccp {
    local PP=$(one_line_pem $4)
    local CP=$(one_line_pem $5)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${P0PORT}/$2/" \
        -e "s/\${CAPORT}/$3/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        organizations/ccp-template.yaml | sed -e $'s/\\\\n/\\\n          /g'
}

ORG=1
P0PORT=${ORG1_PORT}
CAPORT=${CA_ORG1_PORT}
PEERPEM=organizations/peerOrganizations/org1.blocktrace.com/tlsca/tlsca.org1.blocktrace.com-cert.pem
CAPEM=organizations/peerOrganizations/org1.blocktrace.com/ca/ca.org1.blocktrace.com-cert.pem

echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/org1.blocktrace.com/connection-org1.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/org1.blocktrace.com/connection-org1.yaml

ORG=2
P0PORT=${ORG2_PORT}
CAPORT=${CA_ORG2_PORT}
PEERPEM=organizations/peerOrganizations/org2.blocktrace.com/tlsca/tlsca.org2.blocktrace.com-cert.pem
CAPEM=organizations/peerOrganizations/org2.blocktrace.com/ca/ca.org2.blocktrace.com-cert.pem

echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/org2.blocktrace.com/connection-org2.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/org2.blocktrace.com/connection-org2.yaml
