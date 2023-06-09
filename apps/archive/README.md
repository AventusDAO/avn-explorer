# Archive

Raw archives of the chain data

## How to run

- Configure `.env` (see below)
- Start database (see root's docker compose)
- On the first run (for each environment) init the DB: `make init`
- Start Explorer and Gateway: `make up`
- Start Ingester: `make ingest`

## Environment Variables

```
# -- database config --
DB_PASS=postgres
DB_USER=postgres
DB_PORT=5432
DB_HOST=host.docker.internal

DB_NAME=parachain_dev
# -- ingester --
AVN_NODE=wss://avn-parachain.dev.aventus.io

# -- explorer config --
EXPLORER_PORT=4444

# -- gateway config --
GATEWAY_PORT=8888
DATABASE_STATEMENT_TIMEOUT=60000
DATABASE_MAX_CONNECTIONS=100
```

# Solochain Archive

Solochain is based on an older Substrate runtime that requires external custom types.

Versioned types bundle is distributed as `avn-types` npm package ([repository](https://github.com/Aventus-Network-Services/avn-types/blob/master/index.js)), but it needs to be transformed to a single JSON file.

We don't have it automated, but the work on solochain is stopped so it doesn't need to be.

## Types error

The ingester had issues parsing the solochain genesis blocks.

The types in this repo were slightly modified:

1. The subsquid expects a slightly different format. The `avn-types` package has been compiled from a js file, into .json file, to a format required by the `ingester` code.

2. Added `EthKey` type to the base types, that is missing in the `avn-types`:

```json
  "EthKey": "H512"
```
