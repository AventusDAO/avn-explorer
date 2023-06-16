# Config

Package containing configuration utilities for processor apps.

## Environment variables

Add these variable to the app using this package:

```bash
DB_NAME=<processor_name>_db
DB_PASS=postgres
DB_USER=postgres
DB_PORT=5432
DB_HOST=localhost
GQL_PORT=4350

CHAIN_URL=wss://avn-parachain.dev.aventus.io
ARCHIVE_GATEWAY_URL=http://localhost:8888/graphql
# ARCHIVE_GATEWAY_URL=https://archive-gateway.dev.aventus.io/graphql
TYPES_BUNDLE_FILE_NAME=avn-types.json

# PROCESSOR_PROMETHEUS_PORT=3456
# PROCESSOR_RANGE_FROM=0
# PROCESSOR_RANGE_TO=
PROCESSOR_BATCH_SIZE=50
```
