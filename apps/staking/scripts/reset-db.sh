set -e
make codegen
make build
make down
sleep 10
rm -rf ./db/migrations/*.js
rm -rf ./db/data
make up
sleep 30
make migration
make migrate