up:
	@docker-compose up -d

explorer:
	@docker-compose up db gateway explorer -d

ingest:
	@docker-compose up db ingest -d 

pgadmin:
	@docker-compose up db pgadmin -d

down:
	@docker-compose down

ingest-logs:
	@docker logs archive_ingest_1 --follow --timestamps