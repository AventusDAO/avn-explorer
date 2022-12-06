set -e
make codegen
make build
make down
sleep 5
rm -rf ./db/migrations/*.js
rm -rf ./db/data
make up
sleep 25
make migration
make migrate