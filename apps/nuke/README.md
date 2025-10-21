# nuke

Utility app / script to clear data in the multitenant DB configuration.

## Features

- **Full Reset (`RESET_*`)**: Drops all tables in the database (both `public` and `squid_processor` schemas)
- **Height Reset (`RESET_HEIGHT_*`)**: Resets the processor height to 0 in `squid_processor.status` table without dropping tables
- Both operations can be enabled independently or together (if both are enabled, height reset is skipped since dropping tables makes it redundant)

## Configuration

App requires following environment variables.
Note that the env var on devops side for database name is DB_SCHEMA.

```
DB_HOST=localhost
DB_PORT=5432

RESET_ARCHIVE=false
RESET_HEIGHT_ARCHIVE=false
DB_USER_ARCHIVE=archive
DB_SCHEMA_ARCHIVE=explorer_archive_db
DB_PASS_ARCHIVE=

RESET_BALANCES=false
RESET_HEIGHT_BALANCES=false
DB_USER_BALANCES=balances
DB_SCHEMA_BALANCES=explorer_balances_db
DB_PASS_BALANCES=

RESET_ERRORS=true
RESET_HEIGHT_ERRORS=false
DB_SCHEMA_ERRORS=explorer_errors_db
DB_USER_ERRORS=postgres
DB_PASS_ERRORS=

RESET_FEES=true
RESET_HEIGHT_FEES=false
DB_USER_FEES=fees
DB_SCHEMA_FEES=explorer_fees_db
DB_PASS_FEES=

RESET_STAKING=true
RESET_HEIGHT_STAKING=false
DB_USER_STAKING=staking
DB_SCHEMA_STAKING=explorer_staking_db
DB_PASS_STAKING=

RESET_SUMMARY=true
RESET_HEIGHT_SUMMARY=false
DB_USER_SUMMARY=summary
DB_SCHEMA_SUMMARY=explorer_summary_db
DB_PASS_SUMMARY=

RESET_TOKENS=true
RESET_HEIGHT_TOKENS=false
DB_USER_TOKENS=tokens
DB_SCHEMA_TOKENS=explorer_tokens_db
DB_PASS_TOKENS=

RESET_ACCOUNT_MONITOR=true
RESET_HEIGHT_ACCOUNT_MONITOR=false
DB_USER_ACCOUNT_MONITOR=account-monitor
DB_SCHEMA_ACCOUNT_MONITOR=explorer_account_monitor_db
DB_PASS_ACCOUNT_MONITOR=

RESET_NFT=true
RESET_HEIGHT_NFT=false
DB_USER_NFT=nft
DB_SCHEMA_NFT=explorer_nft_db
DB_PASS_NFT=

RESET_SEARCH=false
RESET_HEIGHT_SEARCH=false
DB_SCHEMA_SEARCH=explorer_search_db
DB_USER_SEARCH=search
DB_PASS_SEARCH=postgres
RESET_SEARCH_INDEXES=false
ES_URL_SEARCH=http://localhost:9200
ES_BLOCKS_INDEX_SEARCH=blocks
ES_EXTRINSICS_INDEX_SEARCH=extrinsics
ES_EVENTS_INDEX_SEARCH=events

RESET_SOLOCHAIN_SEARCH=false
RESET_HEIGHT_SOLOCHAIN_SEARCH=false
DB_SCHEMA_SOLOCHAIN_SEARCH=solochain-search
DB_USER_SOLOCHAIN_SEARCH=postgres
DB_PASS_SOLOCHAIN_SEARCH=postgres

RESET_NODE_MANAGER=false
RESET_HEIGHT_NODE_MANAGER=false
DB_SCHEMA_NODEMANAGER=node-manager
DB_USER_NODEMANAGER=postgres
DB_PASS_NODEMANAGER=postgres

RESET_ASSETS=false
RESET_HEIGHT_ASSETS=false
DB_SCHEMA_ASSETS=explorer_assets_db
DB_USER_ASSETS=assets
DB_PASS_ASSETS=
```

## Usage Examples

### Reset height only (for node-manager)
```bash
RESET_NODE_MANAGER=false
RESET_HEIGHT_NODE_MANAGER=true
```
This will connect to the node-manager database and set `squid_processor.status.height = 0` without dropping any tables.

### Drop all tables (full reset)
```bash
RESET_NODE_MANAGER=true
RESET_HEIGHT_NODE_MANAGER=false
```
This will drop all tables in both `public` and `squid_processor` schemas.

### Both flags enabled
```bash
RESET_NODE_MANAGER=true
RESET_HEIGHT_NODE_MANAGER=true
```
Height reset is skipped automatically since dropping tables makes it redundant. Only table dropping will occur.

> NOTE: don't forget to append new env vars when adding a new processor
