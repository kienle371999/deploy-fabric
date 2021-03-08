connect-to-explorer:
	cd blockchain-explorer/app/persistence/fabric/postgreSQL && sudo chmod -R 777 db 
	cd blockchain-explorer/app/persistence/fabric/postgreSQL/db && ./createdb.sh
	cd blockchain-explorer && sudo chmod -R 777 main.sh && ./main.sh clean && ./main.sh install
	cd blockchain-explorer && ./start.sh