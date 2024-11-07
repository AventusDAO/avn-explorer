up:
	@docker-compose up -d

down:
	@docker-compose down

process: migrate
	@yarn processor:debug

serve:
	@yarn server:start

migrate:
	@yarn db:migrate

migration:
	@yarn squid-typeorm-migration-generate

build:
	@yarn build

codegen:
	@yarn squid-typeorm-codegen

typegen-parachain-mainnet:
	@yarn squid-substrate-typegen ./typegen/typegen-parachain.mainnet.json

typegen-parachain-testnet:
	@yarn squid-substrate-typegen ./typegen/typegen-parachain.testnet.json


typegen-parachain-dev:
	@yarn squid-substrate-typegen ./typegen/typegen-parachain.dev.json