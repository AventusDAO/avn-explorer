# nuke

Package to clear data in the multitenant DB configuration.

## Configuration

Package requires following environment variables:

```
DB_NAME=parachain-dev
DB_HOST=localhost
DB_PORT=5432

RESET_ARCHIVE=false
DB_USER_ARCHIVE=archive
DB_SCHEMA_ARCHIVE=archive
DB_PASS_ARCHIVE=

RESET_BALANCES=false
DB_USER_BALANCES=balances
DB_SCHEMA_BALANCES=balances
DB_PASS_BALANCES=

RESET_FEES=true
DB_USER_FEES=fees
DB_SCHEMA_FEES=fees
DB_PASS_FEES=

RESET_STAKING=true
DB_USER_STAKING=staking
DB_SCHEMA_STAKING=staking
DB_PASS_STAKING=

RESET_SUMMARY=true
DB_USER_SUMMARY=summary
DB_SCHEMA_SUMMARY=summary
DB_PASS_SUMMARY=

RESET_TOKENS=true
DB_USER_TOKENS=tokens
DB_SCHEMA_TOKENS=tokens
DB_PASS_TOKENS=
```

> NOTE: don't forget to append new env vars when adding a new processor
