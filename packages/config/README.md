# Config

Package containing configuration utilities for apps.

## Environment variables

Add these variable to the app using this package:

```
DB_NAME=<processor_name>_db
DB_PASS=postgres
DB_USER=postgres
DB_PORT=5432
DB_HOST=localhost
GQL_PORT=4350

AVN_ENV=parachain-dev

# optionally override archive (gateway) url:
# ARCHIVE_URL=http://localhost:8888/graphql
# ARCHIVE_URL=https://archive-gateway.public-testnet.aventus.io/graphql

PROCESSOR_PROMETHEUS_PORT=3000
# PROCESSOR_RANGE_FROM=0
# PROCESSOR_RANGE_TO=
PROCESSOR_BATCH_SIZE=300
```
