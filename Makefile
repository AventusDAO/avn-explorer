install:
	@yarn
	
build:
	@yarn build

up:
	@cd apps/archive && make up
	@cd apps/balances && make up

down:
	@cd apps/archive && make down
	@cd apps/balances && make down
