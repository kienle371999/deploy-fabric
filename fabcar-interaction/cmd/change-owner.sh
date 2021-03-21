CAR_NUMBER=$1
OWNER=$2

echo $CAR_NUMBER $OWNER

kubectl exec -it fabric-tools -- sh -c "peer chaincode invoke -C mychannel -o hlf-orderer--orderer--orderer0:7050 --name fabcar  --peerAddresses hlf-peer--org1--peer0:7051 --peerAddresses hlf-peer--org2--peer0:7051  -c '{\"function\":\"changeCarOwner\",\"Args\":[\"$CAR_NUMBER\", \"$OWNER\"]}'"