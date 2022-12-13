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

reset:
	@yarn db:reset

reprocess: reset process

migrate:
	@yarn processor:migrate

migration:
	@yarn squid-typeorm-migration-generate

codegen:
	@yarn squid-typeorm-codegen

typegen-testnet:
	@yarn squid-substrate-typegen ./typegen/typegen.testnet.json

typegen-parachain:
	@yarn squid-substrate-typegen ./typegen/typegen-parachain.dev.json


.PHONY: up down build process serve reset reprocess migrate migration codegen typegen-testnet typegen-parachain
