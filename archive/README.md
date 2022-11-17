# Archive

Raw archives of the chain data

## How to run

- Configure `.env`
```
DB_NAME=avn-archive
DB_PASS=avn-archive
DB_USER=postgres
DB_PORT=5432
GATEWAY_PORT=8888
EXPLORER_PORT=4444
AVN_ENV=parachain-dev
AVN_NODE=wss://avn-parachain.dev.aventus.io
```
- Start archive and ingestion: `make up`