up:
	@docker-compose up -d

down:
	@docker-compose down

build:
	@yarn build

process: migrate
	@yarn processor:debug

serve:
	@yarn server:start

typegen-parachain-testnet:
	@yarn squid-substrate-typegen ./typegen/typegen-parachain.testnet.json

typegen-parachain-dev:
	@yarn squid-substrate-typegen ./typegen/typegen-parachain.dev.json

codegen:
	@yarn squid-typeorm-codegen

.PHONY: up down build process serve reset reprocess migrate migration codegen typegen-testnet typegen-parachain
