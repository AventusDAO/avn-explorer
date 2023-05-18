# Search Server

API serving indexed search data from the Open Search database.

# Setup

## Environment variables

```bash
# the url of the database (ElasticSearch)
DB_URL=http://localhost:9200
# the list of allowed origins for CORS, comma separated
CORS_ALLOWED_URLS=http://localhost:3300,https://explorer.dev.aventus.io
```

Additional environment variables used:

```bash
DB_BLOCKS_INDEX=blocks
DB_EXTRINSICS_INDEX=extrinsics
DB_EVENTS_INDEX=events

# the port to listen for the incoming requests, by default it's 3000
PORT=3000
STATUS_PORT=3100
# logger setup
LOG_LEVEL=info
LOG_USE_COLOR=true
```
