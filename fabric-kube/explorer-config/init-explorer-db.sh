rm -rf /fabric-storage/config/explorer/
mkdir -p /fabric-storage/config/explorer/db/
mkdir -p /fabric-storage/config/explorer/app/
cd /fabric-storage/config/explorer/db/
wget https://raw.githubusercontent.com/hyperledger/blockchain-explorer/master/app/persistence/fabric/postgreSQL/db/createdb.sh
wget https://raw.githubusercontent.com/hyperledger/blockchain-explorer/master/app/persistence/fabric/postgreSQL/db/explorerpg.sql
wget https://raw.githubusercontent.com/hyperledger/blockchain-explorer/master/app/persistence/fabric/postgreSQL/db/processenv.js
wget https://raw.githubusercontent.com/hyperledger/blockchain-explorer/master/app/persistence/fabric/postgreSQL/db/updatepg.sql
apk update
apk add jq
apk add nodejs
apk add sudo
rm -rf /var/cache/apk/*
chmod +x ./createdb.sh
./createdb.sh