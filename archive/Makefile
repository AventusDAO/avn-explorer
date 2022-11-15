# Parachain-Dev

up-parchain:
	@docker-compose -f ./docker-compose.parachain.yml up

explorer-parachain:
	@docker-compose -f ./docker-compose.parachain.yml up -d db gateway explorer

ingest-parachain:
	@docker-compose -f ./docker-compose.parachain.yml up db ingest 

pgadmin-parchain:
	@docker-compose -f ./docker-compose.parachain.yml up db pgadmin -d

down-parachain:
	@docker-compose -f ./docker-compose.parachain.yml down

# Testnet

up-testnet:
	@docker-compose -f ./docker-compose.testnet.yml up

explorer-testnet:
	@docker-compose -f ./docker-compose.testnet.yml up -d db gateway explorer

ingest-testnet:
	@docker-compose -f ./docker-compose.testnet.yml up db ingest

down-testnet:
	@docker-compose -f ./docker-compose.testnet.yml down

