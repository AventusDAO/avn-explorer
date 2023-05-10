# Archive

Raw archives of the chain data

## How to run

- Configure `.env`

```
DB_NAME=parachain-dev
DB_PASS=postgres
DB_USER=postgres
DB_PORT=5432
GATEWAY_PORT=8888
EXPLORER_PORT=4444
AVN_NODE=wss://avn-parachain.dev.aventus.io
```

- Start archive and ingestion: `make up`

# Solochain Archive

Solochain is based on an older Substrate runtime that requires external custom types.

Versioned types bundle is distributed as `avn-types` npm package ([repository](https://github.com/Aventus-Network-Services/avn-types/blob/master/index.js)), but it needs to be transformed to a single JSON file.

We don't have it automated, but the work on solochain is stopped so it doesn't need to be.

## Types error

The ingester had issues parsing the solochain genesis blocks. So if the types need to be updated, see if the following fix needs to added:

```json
  "EthKey": "H512"
```

to base types and

```json
  "EthEventCheckResult": {
    "event": "EthEvent",
    "result": "CheckResult",
    "checked_by": "AccountId",
    "checked_at_block": "BlockNumber",
    "ready_for_processing_after_block": "BlockNumber",
    "min_challenge_votes": "u32"
  },
```

to types for `[271, null]` specVersion range.
