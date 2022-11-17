# Balances
 
This is a Squid based processor listing accounts and their AVT balance changes.

## How to run

- Make sure you have access to an Aventus chain archive
- Add `.env` file:
```
DB_NAME=avn-balances
DB_PASS=avn-balances
DB_USER=postgres
DB_PORT=23798
PROCESSOR_PROMETHEUS_PORT=3000
GQL_PORT=4350
AVN_ENV=parachain-dev
```
- Install dependencies: `npm i`
- Build project: `make build`
- Run database: `make up`
- Start processing: `make process`
- Serve the data over GraphQL: `make serve`
- To inspect the data via GraphQL UI go to: `http://localhost:4350/graphql`