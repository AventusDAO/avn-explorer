install:
	@yarn
	
build:
	@yarn build

up:
	@docker-compose up -d db && cd apps/archive && make up

ingest:
	@cd apps/archive && make ingest

pgadmin:
	@docker-compose up -d pgadmin

down:
	@docker-compose down && cd apps/archive && make down
