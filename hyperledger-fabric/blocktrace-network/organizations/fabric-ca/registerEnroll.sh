#!/bin/bash

source scriptUtils.sh

function createOrg1() {

  infoln "Enroll the CA admin"
  mkdir -p organizations/peerOrganizations/org1.blocktrace.com/

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/org1.blocktrace.com/
  #  rm -rf $FABRIC_CA_CLIENT_HOME/fabric-ca-client-config.yaml
  #  rm -rf $FABRIC_CA_CLIENT_HOME/msp

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:${CA_ORG1_PORT} --caname ca-org1 --tls.certfiles ${PWD}/organizations/fabric-ca/org1/tls-cert.pem
  { set +x; } 2>/dev/null

  echo "NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-${CA_ORG1_PORT}-ca-org1.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-${CA_ORG1_PORT}-ca-org1.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-${CA_ORG1_PORT}-ca-org1.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-${CA_ORG1_PORT}-ca-org1.pem
    OrganizationalUnitIdentifier: orderer" >${PWD}/organizations/peerOrganizations/org1.blocktrace.com/msp/config.yaml

  infoln "Register peer0"
  set -x
  fabric-ca-client register --caname ca-org1 --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles ${PWD}/organizations/fabric-ca/org1/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Register user"
  set -x
  fabric-ca-client register --caname ca-org1 --id.name user1 --id.secret user1pw --id.type client --tls.certfiles ${PWD}/organizations/fabric-ca/org1/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Register the org admin"
  set -x
  fabric-ca-client register --caname ca-org1 --id.name org1admin --id.secret org1adminpw --id.type admin --tls.certfiles ${PWD}/organizations/fabric-ca/org1/tls-cert.pem
  { set +x; } 2>/dev/null

  mkdir -p organizations/peerOrganizations/org1.blocktrace.com/peers
  mkdir -p organizations/peerOrganizations/org1.blocktrace.com/peers/peer0.org1.blocktrace.com

  infoln "Generate the peer0 msp"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:${CA_ORG1_PORT} --caname ca-org1 -M ${PWD}/organizations/peerOrganizations/org1.blocktrace.com/peers/peer0.org1.blocktrace.com/msp --csr.hosts peer0.org1.blocktrace.com --tls.certfiles ${PWD}/organizations/fabric-ca/org1/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/org1.blocktrace.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/org1.blocktrace.com/peers/peer0.org1.blocktrace.com/msp/config.yaml

  infoln "Generate the peer0-tls certificates"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:${CA_ORG1_PORT} --caname ca-org1 -M ${PWD}/organizations/peerOrganizations/org1.blocktrace.com/peers/peer0.org1.blocktrace.com/tls --enrollment.profile tls --csr.hosts peer0.org1.blocktrace.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/org1/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/org1.blocktrace.com/peers/peer0.org1.blocktrace.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/org1.blocktrace.com/peers/peer0.org1.blocktrace.com/tls/ca.crt
  cp ${PWD}/organizations/peerOrganizations/org1.blocktrace.com/peers/peer0.org1.blocktrace.com/tls/signcerts/* ${PWD}/organizations/peerOrganizations/org1.blocktrace.com/peers/peer0.org1.blocktrace.com/tls/server.crt
  cp ${PWD}/organizations/peerOrganizations/org1.blocktrace.com/peers/peer0.org1.blocktrace.com/tls/keystore/* ${PWD}/organizations/peerOrganizations/org1.blocktrace.com/peers/peer0.org1.blocktrace.com/tls/server.key

  mkdir -p ${PWD}/organizations/peerOrganizations/org1.blocktrace.com/msp/tlscacerts
  cp ${PWD}/organizations/peerOrganizations/org1.blocktrace.com/peers/peer0.org1.blocktrace.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/org1.blocktrace.com/msp/tlscacerts/ca.crt

  mkdir -p ${PWD}/organizations/peerOrganizations/org1.blocktrace.com/tlsca
  cp ${PWD}/organizations/peerOrganizations/org1.blocktrace.com/peers/peer0.org1.blocktrace.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/org1.blocktrace.com/tlsca/tlsca.org1.blocktrace.com-cert.pem

  mkdir -p ${PWD}/organizations/peerOrganizations/org1.blocktrace.com/ca
  cp ${PWD}/organizations/peerOrganizations/org1.blocktrace.com/peers/peer0.org1.blocktrace.com/msp/cacerts/* ${PWD}/organizations/peerOrganizations/org1.blocktrace.com/ca/ca.org1.blocktrace.com-cert.pem

  mkdir -p organizations/peerOrganizations/org1.blocktrace.com/users
  mkdir -p organizations/peerOrganizations/org1.blocktrace.com/users/User1@org1.blocktrace.com

  infoln "Generate the user msp"
  set -x
  fabric-ca-client enroll -u https://user1:user1pw@localhost:${CA_ORG1_PORT} --caname ca-org1 -M ${PWD}/organizations/peerOrganizations/org1.blocktrace.com/users/User1@org1.blocktrace.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/org1/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/org1.blocktrace.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/org1.blocktrace.com/users/User1@org1.blocktrace.com/msp/config.yaml

  mkdir -p organizations/peerOrganizations/org1.blocktrace.com/users/Admin@org1.blocktrace.com

  infoln "Generate the org admin msp"
  set -x
  fabric-ca-client enroll -u https://org1admin:org1adminpw@localhost:${CA_ORG1_PORT} --caname ca-org1 -M ${PWD}/organizations/peerOrganizations/org1.blocktrace.com/users/Admin@org1.blocktrace.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/org1/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/org1.blocktrace.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/org1.blocktrace.com/users/Admin@org1.blocktrace.com/msp/config.yaml
}

function createOrg2() {

  infoln "Enroll the CA admin"
  mkdir -p organizations/peerOrganizations/org2.blocktrace.com/

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/org2.blocktrace.com/
  #  rm -rf $FABRIC_CA_CLIENT_HOME/fabric-ca-client-config.yaml
  #  rm -rf $FABRIC_CA_CLIENT_HOME/msp

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:${CA_ORG2_PORT} --caname ca-org2 --tls.certfiles ${PWD}/organizations/fabric-ca/org2/tls-cert.pem
  { set +x; } 2>/dev/null

  echo "NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-${CA_ORG2_PORT}-ca-org2.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-${CA_ORG2_PORT}-ca-org2.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-${CA_ORG2_PORT}-ca-org2.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-${CA_ORG2_PORT}-ca-org2.pem
    OrganizationalUnitIdentifier: orderer" >${PWD}/organizations/peerOrganizations/org2.blocktrace.com/msp/config.yaml

  infoln "Register peer0"
  set -x
  fabric-ca-client register --caname ca-org2 --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles ${PWD}/organizations/fabric-ca/org2/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Register user"
  set -x
  fabric-ca-client register --caname ca-org2 --id.name user1 --id.secret user1pw --id.type client --tls.certfiles ${PWD}/organizations/fabric-ca/org2/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Register the org admin"
  set -x
  fabric-ca-client register --caname ca-org2 --id.name org2admin --id.secret org2adminpw --id.type admin --tls.certfiles ${PWD}/organizations/fabric-ca/org2/tls-cert.pem
  { set +x; } 2>/dev/null

  mkdir -p organizations/peerOrganizations/org2.blocktrace.com/peers
  mkdir -p organizations/peerOrganizations/org2.blocktrace.com/peers/peer0.org2.blocktrace.com

  infoln "Generate the peer0 msp"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:${CA_ORG2_PORT} --caname ca-org2 -M ${PWD}/organizations/peerOrganizations/org2.blocktrace.com/peers/peer0.org2.blocktrace.com/msp --csr.hosts peer0.org2.blocktrace.com --tls.certfiles ${PWD}/organizations/fabric-ca/org2/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/org2.blocktrace.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/org2.blocktrace.com/peers/peer0.org2.blocktrace.com/msp/config.yaml

  infoln "Generate the peer0-tls certificates"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:${CA_ORG2_PORT} --caname ca-org2 -M ${PWD}/organizations/peerOrganizations/org2.blocktrace.com/peers/peer0.org2.blocktrace.com/tls --enrollment.profile tls --csr.hosts peer0.org2.blocktrace.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/org2/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/org2.blocktrace.com/peers/peer0.org2.blocktrace.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/org2.blocktrace.com/peers/peer0.org2.blocktrace.com/tls/ca.crt
  cp ${PWD}/organizations/peerOrganizations/org2.blocktrace.com/peers/peer0.org2.blocktrace.com/tls/signcerts/* ${PWD}/organizations/peerOrganizations/org2.blocktrace.com/peers/peer0.org2.blocktrace.com/tls/server.crt
  cp ${PWD}/organizations/peerOrganizations/org2.blocktrace.com/peers/peer0.org2.blocktrace.com/tls/keystore/* ${PWD}/organizations/peerOrganizations/org2.blocktrace.com/peers/peer0.org2.blocktrace.com/tls/server.key

  mkdir -p ${PWD}/organizations/peerOrganizations/org2.blocktrace.com/msp/tlscacerts
  cp ${PWD}/organizations/peerOrganizations/org2.blocktrace.com/peers/peer0.org2.blocktrace.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/org2.blocktrace.com/msp/tlscacerts/ca.crt

  mkdir -p ${PWD}/organizations/peerOrganizations/org2.blocktrace.com/tlsca
  cp ${PWD}/organizations/peerOrganizations/org2.blocktrace.com/peers/peer0.org2.blocktrace.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/org2.blocktrace.com/tlsca/tlsca.org2.blocktrace.com-cert.pem

  mkdir -p ${PWD}/organizations/peerOrganizations/org2.blocktrace.com/ca
  cp ${PWD}/organizations/peerOrganizations/org2.blocktrace.com/peers/peer0.org2.blocktrace.com/msp/cacerts/* ${PWD}/organizations/peerOrganizations/org2.blocktrace.com/ca/ca.org2.blocktrace.com-cert.pem

  mkdir -p organizations/peerOrganizations/org2.blocktrace.com/users
  mkdir -p organizations/peerOrganizations/org2.blocktrace.com/users/User1@org2.blocktrace.com

  infoln "Generate the user msp"
  set -x
  fabric-ca-client enroll -u https://user1:user1pw@localhost:${CA_ORG2_PORT} --caname ca-org2 -M ${PWD}/organizations/peerOrganizations/org2.blocktrace.com/users/User1@org2.blocktrace.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/org2/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/org2.blocktrace.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/org2.blocktrace.com/users/User1@org2.blocktrace.com/msp/config.yaml

  mkdir -p organizations/peerOrganizations/org2.blocktrace.com/users/Admin@org2.blocktrace.com

  infoln "Generate the org admin msp"
  set -x
  fabric-ca-client enroll -u https://org2admin:org2adminpw@localhost:${CA_ORG2_PORT} --caname ca-org2 -M ${PWD}/organizations/peerOrganizations/org2.blocktrace.com/users/Admin@org2.blocktrace.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/org2/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/org2.blocktrace.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/org2.blocktrace.com/users/Admin@org2.blocktrace.com/msp/config.yaml

}

function createOrderer() {

  infoln "Enroll the CA admin"
  mkdir -p organizations/ordererOrganizations/blocktrace.com

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/ordererOrganizations/blocktrace.com
  #  rm -rf $FABRIC_CA_CLIENT_HOME/fabric-ca-client-config.yaml
  #  rm -rf $FABRIC_CA_CLIENT_HOME/msp

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:${CA_ORDER_PORT} --caname ca-orderer --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  echo "NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-${CA_ORDER_PORT}-ca-orderer.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-${CA_ORDER_PORT}-ca-orderer.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-${CA_ORDER_PORT}-ca-orderer.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-${CA_ORDER_PORT}-ca-orderer.pem
    OrganizationalUnitIdentifier: orderer" >${PWD}/organizations/ordererOrganizations/blocktrace.com/msp/config.yaml

  infoln "Register orderer"
  set -x
  fabric-ca-client register --caname ca-orderer --id.name orderer --id.secret ordererpw --id.type orderer --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Register the orderer admin"
  set -x
  fabric-ca-client register --caname ca-orderer --id.name ordererAdmin --id.secret ordererAdminpw --id.type admin --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  mkdir -p organizations/ordererOrganizations/blocktrace.com/orderers
  mkdir -p organizations/ordererOrganizations/blocktrace.com/orderers/blocktrace.com

  mkdir -p organizations/ordererOrganizations/blocktrace.com/orderers/orderer.blocktrace.com

  infoln "Generate the orderer msp"
  set -x
  fabric-ca-client enroll -u https://orderer:ordererpw@localhost:${CA_ORDER_PORT} --caname ca-orderer -M ${PWD}/organizations/ordererOrganizations/blocktrace.com/orderers/orderer.blocktrace.com/msp --csr.hosts orderer.blocktrace.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/ordererOrganizations/blocktrace.com/msp/config.yaml ${PWD}/organizations/ordererOrganizations/blocktrace.com/orderers/orderer.blocktrace.com/msp/config.yaml

  infoln "Generate the orderer-tls certificates"
  set -x
  fabric-ca-client enroll -u https://orderer:ordererpw@localhost:${CA_ORDER_PORT} --caname ca-orderer -M ${PWD}/organizations/ordererOrganizations/blocktrace.com/orderers/orderer.blocktrace.com/tls --enrollment.profile tls --csr.hosts orderer.blocktrace.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/ordererOrganizations/blocktrace.com/orderers/orderer.blocktrace.com/tls/tlscacerts/* ${PWD}/organizations/ordererOrganizations/blocktrace.com/orderers/orderer.blocktrace.com/tls/ca.crt
  cp ${PWD}/organizations/ordererOrganizations/blocktrace.com/orderers/orderer.blocktrace.com/tls/signcerts/* ${PWD}/organizations/ordererOrganizations/blocktrace.com/orderers/orderer.blocktrace.com/tls/server.crt
  cp ${PWD}/organizations/ordererOrganizations/blocktrace.com/orderers/orderer.blocktrace.com/tls/keystore/* ${PWD}/organizations/ordererOrganizations/blocktrace.com/orderers/orderer.blocktrace.com/tls/server.key

  mkdir -p ${PWD}/organizations/ordererOrganizations/blocktrace.com/orderers/orderer.blocktrace.com/msp/tlscacerts
  cp ${PWD}/organizations/ordererOrganizations/blocktrace.com/orderers/orderer.blocktrace.com/tls/tlscacerts/* ${PWD}/organizations/ordererOrganizations/blocktrace.com/orderers/orderer.blocktrace.com/msp/tlscacerts/tlsca.blocktrace.com-cert.pem

  mkdir -p ${PWD}/organizations/ordererOrganizations/blocktrace.com/msp/tlscacerts
  cp ${PWD}/organizations/ordererOrganizations/blocktrace.com/orderers/orderer.blocktrace.com/tls/tlscacerts/* ${PWD}/organizations/ordererOrganizations/blocktrace.com/msp/tlscacerts/tlsca.blocktrace.com-cert.pem

  mkdir -p organizations/ordererOrganizations/blocktrace.com/users
  mkdir -p organizations/ordererOrganizations/blocktrace.com/users/Admin@blocktrace.com

  infoln "Generate the admin msp"
  set -x
  fabric-ca-client enroll -u https://ordererAdmin:ordererAdminpw@localhost:${CA_ORDER_PORT} --caname ca-orderer -M ${PWD}/organizations/ordererOrganizations/blocktrace.com/users/Admin@blocktrace.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/ordererOrganizations/blocktrace.com/msp/config.yaml ${PWD}/organizations/ordererOrganizations/blocktrace.com/users/Admin@blocktrace.com/msp/config.yaml
}
