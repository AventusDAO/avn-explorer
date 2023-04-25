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

typegen-testnet:
	@yarn squid-substrate-typegen ./typegen/typegen.testnet.json

typegen-parachain:
	@yarn squid-substrate-typegen ./typegen/typegen-parachain.dev.json


.PHONY: up down build process serve reset reprocess migrate migration codegen typegen-testnet typegen-parachain
