process: migrate
	@node -r dotenv/config lib/processor.js


serve:
	@npx squid-graphql-server


migrate:
	@npx squid-typeorm-migration apply


migration:
	@npx squid-typeorm-migration generate


build:
	@npm run build


codegen:
	@npx squid-typeorm-codegen


typegen-testnet:
	@npx squid-substrate-typegen ./typegen/typegen.testnet.json


typegen-parachain:
	@npx squid-substrate-typegen ./typegen/typegen-parachain.dev.json


up:
	@docker-compose up -d


down:
	@docker-compose down


.PHONY: process serve start codegen migration migrate up down typegen
