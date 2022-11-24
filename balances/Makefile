process: migrate
	@node -r dotenv/config lib/processor.js


serve:
	@yarn squid-graphql-server


migrate:
	@yarn squid-typeorm-migration-apply


migration:
	@yarn squid-typeorm-migration-generate


build:
	@yarn build


codegen:
	@yarn squid-typeorm-codegen


typegen-testnet:
	@yarn squid-substrate-typegen ./typegen/typegen.testnet.json


typegen-parachain:
	@yarn squid-substrate-typegen ./typegen/typegen-parachain.dev.json


up:
	@docker-compose up -d


down:
	@docker-compose down


.PHONY: process serve start codegen migration migrate up down typegen
