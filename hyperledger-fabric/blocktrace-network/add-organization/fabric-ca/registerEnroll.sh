function createOrg {
  ORG_NAME="$1"
  CA_ORG_PORT="$2"

  echo
	echo "Enroll the CA admin"
  echo
	mkdir -p ../organizations/peerOrganizations/${ORG_NAME}.blocktrace.com/

	export FABRIC_CA_CLIENT_HOME=${PWD}/../organizations/peerOrganizations/${ORG_NAME}.blocktrace.com/
#  rm -rf $FABRIC_CA_CLIENT_HOME/fabric-ca-client-config.yaml
#  rm -rf $FABRIC_CA_CLIENT_HOME/msp

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:${CA_ORG_PORT} --caname ca-${ORG_NAME} --tls.certfiles ${PWD}/fabric-ca/${ORG_NAME}/tls-cert.pem
  { set +x; } 2>/dev/null

  echo "NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-${CA_ORG_PORT}-ca-${ORG_NAME}.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-${CA_ORG_PORT}-ca-${ORG_NAME}.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-${CA_ORG_PORT}-ca-${ORG_NAME}.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-${CA_ORG_PORT}-ca-${ORG_NAME}.pem
    OrganizationalUnitIdentifier: orderer" > ${PWD}/../organizations/peerOrganizations/${ORG_NAME}.blocktrace.com/msp/config.yaml

  echo
	echo "Register peer0"
  echo
  set -x
	fabric-ca-client register --caname ca-${ORG_NAME} --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles ${PWD}/fabric-ca/${ORG_NAME}/tls-cert.pem
  { set +x; } 2>/dev/null

  echo
  echo "Register user"
  echo
  set -x
  fabric-ca-client register --caname ca-${ORG_NAME} --id.name user1 --id.secret user1pw --id.type client --tls.certfiles ${PWD}/fabric-ca/${ORG_NAME}/tls-cert.pem
  { set +x; } 2>/dev/null

  echo
  echo "Register the org admin"
  echo
  set -x
  fabric-ca-client register --caname ca-${ORG_NAME} --id.name ${ORG_NAME}admin --id.secret ${ORG_NAME}adminpw --id.type admin --tls.certfiles ${PWD}/fabric-ca/${ORG_NAME}/tls-cert.pem
  { set +x; } 2>/dev/null

	mkdir -p ../organizations/peerOrganizations/${ORG_NAME}.blocktrace.com/peers
  mkdir -p ../organizations/peerOrganizations/${ORG_NAME}.blocktrace.com/peers/peer0.${ORG_NAME}.blocktrace.com

  echo
  echo "## Generate the peer0 msp"
  echo
  set -x
	fabric-ca-client enroll -u https://peer0:peer0pw@localhost:${CA_ORG_PORT} --caname ca-${ORG_NAME} -M ${PWD}/../organizations/peerOrganizations/${ORG_NAME}.blocktrace.com/peers/peer0.${ORG_NAME}.blocktrace.com/msp --csr.hosts peer0.${ORG_NAME}.blocktrace.com --tls.certfiles ${PWD}/fabric-ca/${ORG_NAME}/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/../organizations/peerOrganizations/${ORG_NAME}.blocktrace.com/msp/config.yaml ${PWD}/../organizations/peerOrganizations/${ORG_NAME}.blocktrace.com/peers/peer0.${ORG_NAME}.blocktrace.com/msp/config.yaml

  echo
  echo "## Generate the peer0-tls certificates"
  echo
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:${CA_ORG_PORT} --caname ca-${ORG_NAME} -M ${PWD}/../organizations/peerOrganizations/${ORG_NAME}.blocktrace.com/peers/peer0.${ORG_NAME}.blocktrace.com/tls --enrollment.profile tls --csr.hosts peer0.${ORG_NAME}.blocktrace.com --csr.hosts localhost --tls.certfiles ${PWD}/fabric-ca/${ORG_NAME}/tls-cert.pem
  { set +x; } 2>/dev/null


  cp ${PWD}/../organizations/peerOrganizations/${ORG_NAME}.blocktrace.com/peers/peer0.${ORG_NAME}.blocktrace.com/tls/tlscacerts/* ${PWD}/../organizations/peerOrganizations/${ORG_NAME}.blocktrace.com/peers/peer0.${ORG_NAME}.blocktrace.com/tls/ca.crt
  cp ${PWD}/../organizations/peerOrganizations/${ORG_NAME}.blocktrace.com/peers/peer0.${ORG_NAME}.blocktrace.com/tls/signcerts/* ${PWD}/../organizations/peerOrganizations/${ORG_NAME}.blocktrace.com/peers/peer0.${ORG_NAME}.blocktrace.com/tls/server.crt
  cp ${PWD}/../organizations/peerOrganizations/${ORG_NAME}.blocktrace.com/peers/peer0.${ORG_NAME}.blocktrace.com/tls/keystore/* ${PWD}/../organizations/peerOrganizations/${ORG_NAME}.blocktrace.com/peers/peer0.${ORG_NAME}.blocktrace.com/tls/server.key

  mkdir ${PWD}/../organizations/peerOrganizations/${ORG_NAME}.blocktrace.com/msp/tlscacerts
  cp ${PWD}/../organizations/peerOrganizations/${ORG_NAME}.blocktrace.com/peers/peer0.${ORG_NAME}.blocktrace.com/tls/tlscacerts/* ${PWD}/../organizations/peerOrganizations/${ORG_NAME}.blocktrace.com/msp/tlscacerts/ca.crt

  mkdir ${PWD}/../organizations/peerOrganizations/${ORG_NAME}.blocktrace.com/tlsca
  cp ${PWD}/../organizations/peerOrganizations/${ORG_NAME}.blocktrace.com/peers/peer0.${ORG_NAME}.blocktrace.com/tls/tlscacerts/* ${PWD}/../organizations/peerOrganizations/${ORG_NAME}.blocktrace.com/tlsca/tlsca.${ORG_NAME}.blocktrace.com-cert.pem

  mkdir ${PWD}/../organizations/peerOrganizations/${ORG_NAME}.blocktrace.com/ca
  cp ${PWD}/../organizations/peerOrganizations/${ORG_NAME}.blocktrace.com/peers/peer0.${ORG_NAME}.blocktrace.com/msp/cacerts/* ${PWD}/../organizations/peerOrganizations/${ORG_NAME}.blocktrace.com/ca/ca.${ORG_NAME}.blocktrace.com-cert.pem

  mkdir -p ../organizations/peerOrganizations/${ORG_NAME}.blocktrace.com/users
  mkdir -p ../organizations/peerOrganizations/${ORG_NAME}.blocktrace.com/users/User1@${ORG_NAME}.blocktrace.com

  echo
  echo "## Generate the user msp"
  echo
  set -x
	fabric-ca-client enroll -u https://user1:user1pw@localhost:${CA_ORG_PORT} --caname ca-${ORG_NAME} -M ${PWD}/../organizations/peerOrganizations/${ORG_NAME}.blocktrace.com/users/User1@${ORG_NAME}.blocktrace.com/msp --tls.certfiles ${PWD}/fabric-ca/${ORG_NAME}/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/../organizations/peerOrganizations/${ORG_NAME}.blocktrace.com/msp/config.yaml ${PWD}/../organizations/peerOrganizations/${ORG_NAME}.blocktrace.com/users/User1@${ORG_NAME}.blocktrace.com/msp/config.yaml

  mkdir -p ../organizations/peerOrganizations/${ORG_NAME}.blocktrace.com/users/Admin@${ORG_NAME}.blocktrace.com

  echo
  echo "## Generate the org admin msp"
  echo
  set -x
	fabric-ca-client enroll -u https://${ORG_NAME}admin:${ORG_NAME}adminpw@localhost:${CA_ORG_PORT} --caname ca-${ORG_NAME} -M ${PWD}/../organizations/peerOrganizations/${ORG_NAME}.blocktrace.com/users/Admin@${ORG_NAME}.blocktrace.com/msp --tls.certfiles ${PWD}/fabric-ca/${ORG_NAME}/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/../organizations/peerOrganizations/${ORG_NAME}.blocktrace.com/msp/config.yaml ${PWD}/../organizations/peerOrganizations/${ORG_NAME}.blocktrace.com/users/Admin@${ORG_NAME}.blocktrace.com/msp/config.yaml

}
