up:
	@docker-compose up -d gateway explorer

init:
	@yarn db:init

ingest:
	@docker-compose up -d ingest 

pgadmin:
	@docker-compose up -d pgadmin

down:
	@docker-compose down

ingest-logs:
	@docker logs archive_ingest_1 --follow --timestamps