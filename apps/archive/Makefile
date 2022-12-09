up:
	@docker-compose up -d

explorer:
	@docker-compose up -d db gateway explorer

ingest:
	@docker-compose up db ingest 

pgadmin:
	@docker-compose up -d db pgadmin

down:
	@docker-compose down

ingest-logs:
	@docker logs archive_ingest_1 --follow --timestamps