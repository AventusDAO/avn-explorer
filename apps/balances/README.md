# Balances

This is a Squid based processor listing accounts and their AVT balance changes.

## How to run

- Make sure you have access to an Aventus chain archive
- Configure `.env` file
- Install dependencies: `yarn`
- Build project: `make build`
- Run database: `make up`
- Start processing: `make process`
- Serve the data over GraphQL: `make serve`
- To inspect the data via GraphQL UI go to: `http://localhost:4350/graphql`

## Environement variables

```
DB_NAME=avn-balances
DB_PASS=avn-balances
DB_USER=postgres
DB_PORT=23798
GQL_PORT=4350

AVN_ENV=parachain-dev
ARCHIVE_URL=http://localhost:8888/graphql

PROCESSOR_PROMETHEUS_PORT=3000
# PROCESSOR_RANGE_FROM=0
# PROCESSOR_RANGE_TO=
PROCESSOR_BATCH_SIZE=300
```
