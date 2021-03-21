CAR_NUMBER=$1
MAKE=$2
MODEL=$3
COLOR=$4
OWNER=$5

echo $CAR_NUMBER $MAKE $MODEL $COLOR $OWNER

kubectl exec -it fabric-tools -- sh -c "peer chaincode invoke -C mychannel -o hlf-orderer--orderer--orderer0:7050 --name fabcar  --peerAddresses hlf-peer--org1--peer0:7051 --peerAddresses hlf-peer--org2--peer0:7051  -c '{\"function\":\"createCar\",\"Args\":[\"$CAR_NUMBER\", \"$MAKE\", \"$MODEL\", \"$COLOR\", \"$OWNER\"]}'"