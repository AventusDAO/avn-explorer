install:
	@yarn
	
build:
	@yarn build

up:
	@cd apps/archive && make up

down:
	@cd apps/archive && make down
