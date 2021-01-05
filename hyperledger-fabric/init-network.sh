#!/bin/bash

if [[ "$(docker images -q hyperledger/fabric-ca 2> /dev/null)" == "" ]] || [[ "$(docker images -q hyperledger/fabric-tools 2> /dev/null)" == "" ]] ||
[[ "$(docker images -q hyperledger/fabric-peer 2> /dev/null)" == "" ]] || [[ "$(docker images -q hyperledger/fabric-orderer 2> /dev/null)" == "" ]] ||
[[ "$(docker images -q hyperledger/fabric-ccenv 2> /dev/null)" == "" ]] || [[ "$(docker images -q hyperledger/fabric-baseos 2> /dev/null)" == "" ]]; then 
    echo "Start pulling the required docker images and binary"
	rm -rf Blockchain/bin
	rm -rf fabric-samples && curl -sSL https://bit.ly/2ysbOFE | bash -s
	cp -av fabric-samples/bin Blockchain/bin && rm -rf fabric-samples
else 
    echo "Prerequisites were installed"
fi
