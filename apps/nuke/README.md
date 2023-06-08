# nuke

Utility app / script to clear data in the multitenant DB configuration.

## Configuration

App requires following environment variables.
Note that the env var on devops side for database name is DB_SCHEMA.

```
DB_HOST=localhost
DB_PORT=5432

RESET_ARCHIVE=false
DB_USER_ARCHIVE=archive
DB_SCHEMA_ARCHIVE=explorer_archive_db
DB_PASS_ARCHIVE=

RESET_BALANCES=false
DB_USER_BALANCES=balances
DB_SCHEMA_BALANCES=explorer_balances_db
DB_PASS_BALANCES=

RESET_ERRORS=true
DB_SCHEMA_ERRORS=explorer_errors_db
DB_USER_ERRORS=postgres
DB_PASS_ERRORS=

RESET_FEES=true
DB_USER_FEES=fees
DB_SCHEMA_FEES=explorer_fees_db
DB_PASS_FEES=

RESET_STAKING=true
DB_USER_STAKING=staking
DB_SCHEMA_STAKING=explorer_staking_db
DB_PASS_STAKING=

RESET_SUMMARY=true
DB_USER_SUMMARY=summary
DB_SCHEMA_SUMMARY=explorer_summary_db
DB_PASS_SUMMARY=

RESET_TOKENS=true
DB_USER_TOKENS=tokens
DB_SCHEMA_TOKENS=explorer_tokens_db
DB_PASS_TOKENS=

RESET_ACCOUNT_MONITOR=true
DB_USER_ACCOUNT_MONITOR=account-monitor
DB_SCHEMA_ACCOUNT_MONITOR=explorer_account_monitor_db
DB_PASS_ACCOUNT_MONITOR=

RESET_SEARCH=false
DB_SCHEMA_SEARCH=explorer_search_db
DB_USER_SEARCH=search
DB_PASS_SEARCH=postgres
ES_URL_SEARCH=http://localhost:9200
ES_BLOCKS_INDEX_SEARCH=blocks
ES_EXTRINSICS_INDEX_SEARCH=extrinsics
ES_EVENTS_INDEX_SEARCH=events
```

> NOTE: don't forget to append new env vars when adding a new processor
