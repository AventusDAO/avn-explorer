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
	@make explore-testnet
	@npx squid-substrate-typegen ./typegen/typegen.testnet.json

explore-testnet:
	@npx squid-substrate-metadata-explorer --chain wss://avn.test.aventus.io --archive http://localhost:4444/graphql --out ./typegen/versions.testnet.jsonl


typegen-parachain:
	@make explore-parachain-dev
	@npx squid-substrate-typegen ./typegen/typegen-parachain.dev.json

explore-parachain-dev:
	@npx squid-substrate-metadata-explorer --chain wss://avn-parachain.dev.aventus.io --archive http://localhost:4444/graphql --out ./typegen/versions-parachain.dev.jsonl


up:
	@docker-compose up -d


down:
	@docker-compose down


.PHONY: process serve start codegen migration migrate up down typegen
