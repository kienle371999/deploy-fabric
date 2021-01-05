init-fabric-network:
	./init-network.sh
	cd blocktrace && ./startFabric.sh 
	cd blocktrace/javascript && npm install && node enrollAdmin
init-new-network:
	cd blocktrace && ./startFabric-Org.sh Org3 11051 11052 11054 couchdb3 9084 2
init-new2-network:
	cd blocktrace && ./startFabric-Org.sh Org4 12051 12052 12054 couchdb4 10084 3

connect-to-explorer:
	cd blockchain-explorer/app/persistence/fabric/postgreSQL && sudo chmod -R 777 db 
	cd blockchain-explorer/app/persistence/fabric/postgreSQL/db && ./createdb.sh
	cd blockchain-explorer && sudo chmod -R 777 main.sh && ./main.sh clean && ./main.sh install
	cd blockchain-explorer && ./start.sh