# Alerts Processor

A real-time monitoring and alerting processor for the Aventus blockchain. Monitors account balances, blockchain events, and storage queues, exposing alerts via Prometheus metrics and PostgreSQL persistence.

## Overview

The Alerts Processor continuously monitors:
- **Account Balances**: Tracks operational accounts (relayers, anchoring services) against configurable thresholds
- **Blockchain Events**: Detects specific events (e.g., `Summary.RootPassedValidation`, `TokenManager.FailedToGenerateLowerProof`)
- **Storage Queues**: Monitors queue sizes (e.g., `EthBridge.RequestQueue`) for backpressure detection

Alerts are:
- Stored in PostgreSQL with expiration timestamps
- Exposed as Prometheus metrics at `/metrics` endpoint
- Auto-resolved when conditions return to healthy

## Prerequisites

- **Node.js** 18+ and **Yarn** 3.3.0+
- **Docker** and **Docker Compose** (for local database)
- **PostgreSQL** 14+ (or use Docker Compose)
- Access to Aventus chain archive (configured via `ARCHIVE_GATEWAY_URL`)

## Quick Start

### 1. Install Dependencies

```bash
# From monorepo root
yarn install
```

### 2. Configure Environment

```bash
cd apps/alerts
cp env.example .env
```

Edit `.env` with your configuration (see [Configuration](#configuration) section).

### 3. Start Database

```bash
make up
# or
docker-compose up -d
```

### 4. Initialize Database

```bash
make migrate
# or
yarn db:migrate
```

### 5. Build and Run Processor

```bash
# Build TypeScript
make build

# Start processor
make process
# or
yarn processor:start
```

The processor will:
- Load configuration from environment variables (recommended) or config file
- Connect to the chain archive
- Start processing blocks
- Expose metrics at `http://localhost:3001/metrics`

## Configuration

### Environment Variables

The processor supports multiple configuration methods (in priority order):

1. **Environment Variables** (Recommended) ← Use this!
2. Config file path (fallback for legacy setups)

### Recommended: Environment Variables Configuration

Use separate environment variables for each configuration section. This is the **preferred method** for all deployments, especially production.

#### Required Environment Variables

```bash
# Database
DB_NAME=alerts
DB_USER=postgres
DB_PASS=postgres
DB_HOST=localhost
DB_PORT=5432

# Chain
CHAIN_URL=wss://avn-parachain-internal.dev.aventus.network
ARCHIVE_GATEWAY_URL=https://archive-gateway.dev.aventus.network/graphql

# Metrics (optional)
METRICS_PORT=3001
ALERTS_METRICS_FULL_UPDATE_INTERVAL=100
```

#### Alert Configuration via Environment Variables

Configure alerts using three separate environment variables. Each variable contains a JSON array of configurations.

##### 1. Balance Monitoring (`ALERTS_BALANCES`)

Monitor account balances and get alerts when they drop below thresholds.

```bash
ALERTS_BALANCES='[
  {
    "accountAddress": "5GR39XQv4pAMyJHh9qUUi21cnMqgGD4RYidbJLv8D5fTB7Zh",
    "prometheusTags": "environment=dev,network=aventus,account_type=anchoring,priority=critical",
    "warningThreshold": "1000000000000000000",
    "dangerThreshold": "500000000000000000"
  },
  {
    "accountAddress": "5Cf1MLM11BUNXiGyzeo5fAKZTCEPvheWTkRHFw5Hy7AW1naY",
    "prometheusTags": "environment=dev,network=aventus,account_type=relayer,priority=high",
    "warningThreshold": "5000000000000000000",
    "dangerThreshold": "2000000000000000000"
  }
]'
```

**Field Descriptions:**
- `accountAddress`: The SS58 address of the account to monitor
- `prometheusTags`: Comma-separated tags for Prometheus metrics (e.g., `environment=dev,network=aventus`)
- `warningThreshold`: Balance threshold for warning alerts (in smallest unit, e.g., Wei for AVT)
- `dangerThreshold`: Balance threshold for error alerts (must be lower than warning)

**Example Values:**
- `"1000000000000000000"` = 1 AVT (18 decimals)
- `"500000000000000000"` = 0.5 AVT

##### 2. Event Monitoring (`ALERTS_EVENTS`)

Monitor specific blockchain events and get alerts when they occur.

```bash
ALERTS_EVENTS='[
  {
    "eventName": "Summary.RootPassedValidation",
    "prometheusTags": "environment=dev,network=aventus,type=info",
    "includeMetadata": true,
    "severity": "info"
  },
  {
    "eventName": "TokenManager.FailedToGenerateLowerProof",
    "prometheusTags": "environment=dev,network=aventus,type=error",
    "includeMetadata": true,
    "severity": "error"
  }
]'
```

**Field Descriptions:**
- `eventName`: Format `"Section.Method"` (e.g., `"Summary.RootPassedValidation"`)
- `prometheusTags`: Comma-separated tags for Prometheus metrics
- `includeMetadata`: If `true`, includes extrinsic hash in alert message
- `severity`: Optional - `"info"`, `"warning"`, or `"error"` (defaults to `"warning"`)

##### 3. Queue Monitoring (`ALERTS_QUEUES`)

Monitor storage queue sizes to detect backpressure.

```bash
ALERTS_QUEUES='[
  {
    "queueName": "EthBridge.RequestQueue",
    "prometheusTags": "environment=dev,network=aventus,type=bridge",
    "warningThreshold": "10",
    "errorThreshold": "50"
  }
]'
```

**Field Descriptions:**
- `queueName`: Format `"Section.StorageName"` (e.g., `"EthBridge.RequestQueue"`)
- `prometheusTags`: Comma-separated tags for Prometheus metrics
- `warningThreshold`: Queue size threshold for warning alerts (integer as string)
- `errorThreshold`: Queue size threshold for error alerts (must be higher than warning)

#### Complete Example Configuration

Here's a complete `.env` file example:

```bash
# Database
DB_NAME=alerts
DB_USER=postgres
DB_PASS=postgres
DB_HOST=localhost
DB_PORT=5432

# Chain
CHAIN_URL=wss://avn-parachain-internal.dev.aventus.network
ARCHIVE_GATEWAY_URL=https://archive-gateway.dev.aventus.network/graphql

# Metrics
METRICS_PORT=3001

# Balance Monitoring
ALERTS_BALANCES='[{"accountAddress":"5GR39XQv4pAMyJHh9qUUi21cnMqgGD4RYidbJLv8D5fTB7Zh","prometheusTags":"environment=dev,network=aventus,account_type=anchoring,priority=critical","warningThreshold":"1000000000000000000","dangerThreshold":"500000000000000000"}]'

# Event Monitoring
ALERTS_EVENTS='[{"eventName":"Summary.RootPassedValidation","prometheusTags":"environment=dev,network=aventus,type=info","includeMetadata":true}]'

# Queue Monitoring
ALERTS_QUEUES='[{"queueName":"EthBridge.RequestQueue","prometheusTags":"environment=dev,network=aventus,type=bridge","warningThreshold":"10","errorThreshold":"50"}]'
```

### Alternative: Single JSON Environment Variable

If you prefer a single environment variable, you can use `ALERTS_CONFIG_JSON`:

```bash
ALERTS_CONFIG_JSON='{
  "balances": [...],
  "events": [...],
  "queues": [...]
}'
```

> **Note:** We recommend using separate environment variables (`ALERTS_BALANCES`, `ALERTS_EVENTS`, `ALERTS_QUEUES`) as they are easier to manage and update independently.

### Legacy: Config File (Not Recommended)

Config files are supported for backward compatibility but are **not recommended** for new deployments.

If you must use a config file:

```bash
ALERTS_CONFIG_PATH=/path/to/alerts-config.json
```

The processor will also auto-discover config files in these locations:
- `../../config/alerts-config.json`
- `./config/alerts-config.json`
- `./apps/alerts/config/alerts-config.json`

## Deployment Guide

### For DevOps: Kubernetes Deployment

#### Using ConfigMaps and Secrets

#### Balance Configuration

```typescript
{
  accountAddress: string        // SS58 address
  prometheusTags: string       // Comma-separated tags (e.g., "env=dev,type=relayer")
  warningThreshold: string     // BigInt string (avt)
  dangerThreshold: string      // BigInt string (avt)
}
```

#### Event Configuration

```typescript
{
  eventName: string            // Format: "Section.Method" (e.g., "Summary.RootPassedValidation")
  prometheusTags: string
  includeMetadata: boolean     // Include extrinsic hash in alert message
}
```

#### Using Docker Run

```bash
docker run -d \
  --name alerts-processor \
  -e DB_NAME=alerts \
  -e DB_USER=postgres \
  -e DB_PASS=postgres \
  -e DB_HOST=postgres \
  -e DB_PORT=5432 \
  -e CHAIN_URL=wss://avn-parachain-internal.dev.aventus.network \
  -e ARCHIVE_GATEWAY_URL=https://archive-gateway.dev.aventus.network/graphql \
  -e METRICS_PORT=3001 \
  -e ALERTS_BALANCES='[{"accountAddress":"5GR39XQv4pAMyJHh9qUUi21cnMqgGD4RYidbJLv8D5fTB7Zh","prometheusTags":"environment=prod,network=aventus,account_type=anchoring,priority=critical","warningThreshold":"1000000000000000000","dangerThreshold":"500000000000000000"}]' \
  -e ALERTS_EVENTS='[{"eventName":"Summary.RootPassedValidation","prometheusTags":"environment=prod,network=aventus,type=info","includeMetadata":true}]' \
  -e ALERTS_QUEUES='[{"queueName":"EthBridge.RequestQueue","prometheusTags":"environment=prod,network=aventus,type=bridge","warningThreshold":"10","errorThreshold":"50"}]' \
  -p 3001:3001 \
  your-registry/alerts-processor:latest
```

#### Using .env File with Docker

Create a `.env` file:

```bash
DB_NAME=alerts
DB_USER=postgres
DB_PASS=postgres
DB_HOST=postgres
DB_PORT=5432
CHAIN_URL=wss://avn-parachain-internal.dev.aventus.network
ARCHIVE_GATEWAY_URL=https://archive-gateway.dev.aventus.network/graphql

# Metrics (optional)
METRICS_PORT=3001
ALERTS_METRICS_FULL_UPDATE_INTERVAL=100
```


1. **Copy the example file:**
   - Open the `env.example` file in the `apps/alerts` folder
   - Copy it and save as `.env` in the same folder

2. **Edit the `.env` file:**
   - Open `.env` in a text editor
   - Update the account addresses you want to monitor
   - Update the thresholds (the numbers that trigger alerts)
   - Save the file

3. **Run the processor:**
   - Ask your DevOps team or technical lead to help you start the processor
   - They can use the commands in the "Quick Start" section above

**What each setting means:**
- `ALERTS_BALANCES`: Which accounts to monitor and when to alert
- `ALERTS_EVENTS`: Which blockchain events should trigger alerts
- `ALERTS_QUEUES`: Which queues to monitor for backpressure

**Need help?** Contact your DevOps team or technical lead.

## Running the Processor

### Development Mode

```bash
# Watch mode (auto-rebuild on changes)
yarn dev

# Debug mode (with Node.js inspector)
make process
# or
yarn processor:debug
```

### Production Mode

```bash
# Build first
make build

# Run processor
yarn processor:start
```

### Makefile Commands

```bash
make up          # Start Docker Compose (database)
make down        # Stop Docker Compose
make build       # Build TypeScript
make process     # Run processor (with migrations)
make serve       # Start GraphQL server
make reset       # Reset database
make reprocess   # Reset + reprocess from scratch
make migrate     # Run database migrations
make migration   # Generate new migration
make codegen     # Generate TypeORM entities from schema
```

## Testing

### Manual Testing

#### 1. Test Balance Monitoring

1. Configure a test account with low thresholds:
```bash
ALERTS_BALANCES='[{"accountAddress":"YOUR_TEST_ACCOUNT","prometheusTags":"test=true","warningThreshold":"1000000000000000000","dangerThreshold":"500000000000000000"}]'
```

2. Start processor and verify metrics:
```bash
curl http://localhost:3001/metrics | grep avn_balance
```

3. Expected output when balance is low:
```
avn_balance_error{account="YOUR_TEST_ACCOUNT"} 1
```

#### 2. Test Event Monitoring

1. Configure an event that fires frequently:
```bash
ALERTS_EVENTS='[{"eventName":"System.NewAccount","prometheusTags":"test=true","includeMetadata":true}]'
```

2. Check metrics after processing blocks:
```bash
curl http://localhost:3001/metrics | grep avn_event
```

#### 3. Test Queue Monitoring

1. Configure queue monitoring:
```bash
ALERTS_QUEUES='[{"queueName":"EthBridge.RequestQueue","prometheusTags":"test=true","warningThreshold":"1","errorThreshold":"5"}]'
```

2. Monitor queue size:
```bash
curl http://localhost:3001/metrics | grep avn_queue
```

### Verify Alert Persistence

```bash
# Connect to database
psql -h localhost -U postgres -d alerts

# Query active alerts
SELECT * FROM alert WHERE expire_at > NOW() ORDER BY created_at DESC;

# Query by type
SELECT * FROM alert WHERE alert_type = 'balance' AND expire_at > NOW();
```

### Integration Testing

1. **Start test environment**:
```bash
make up
make migrate
make process
```

2. **Monitor logs** for alert creation:
```bash
# Look for alert messages
grep "DANGER\|WARNING" processor.log
```

3. **Check Prometheus metrics**:
```bash
curl http://localhost:3001/metrics
```

4. **Verify auto-resolution**: When conditions return to healthy, alerts should be cleared and metrics reset to 0.

## Monitoring

### Prometheus Metrics Endpoint

```bash
curl http://localhost:3001/metrics
```

#### Available Metrics

- `avn_balance_warning{account="..."}` - Balance warning (1=warning, 0=ok)
- `avn_balance_error{account="..."}` - Balance error (1=error, 0=ok)
- `avn_event_warning{section_method="..."}` - Event warning count
- `avn_event_error{section_method="..."}` - Event error count
- `avn_queue_warning{queue="..."}` - Queue warning (1=warning, 0=ok)
- `avn_queue_error{queue="..."}` - Queue error (1=error, 0=ok)

### Health Endpoint

```bash
curl http://localhost:3001/health
# Returns: {"status":"ok"}
```

### GraphQL API (Optional)

```bash
make serve
# Access at http://localhost:4351/graphql
```

Query alerts:
```graphql
query {
  alerts(where: {expireAt_gt: "2024-01-01T00:00:00Z"}) {
    id
    alertType
    sourceIdentifier
    alertMessage
    isWarning
    isError
    createdAt
    expireAt
  }
}
```

## Troubleshooting

### Processor Won't Start

**Issue**: Configuration errors
```bash
# Check config validation
yarn types:check

# Verify environment variables are set
echo $ALERTS_BALANCES
echo $ALERTS_EVENTS
echo $ALERTS_QUEUES

# Check if variables are properly formatted JSON
echo $ALERTS_BALANCES | jq .
```

**Common JSON formatting errors:**
- Missing quotes around the entire JSON array
- Trailing commas in JSON
- Unescaped quotes inside strings
- Missing commas between array elements

**Fix**: Ensure your environment variables are valid JSON arrays wrapped in single quotes:
```bash
# ✅ Correct
ALERTS_BALANCES='[{"accountAddress":"...","prometheusTags":"..."}]'

# ❌ Wrong - missing quotes
ALERTS_BALANCES=[{"accountAddress":"..."}]

# ❌ Wrong - double quotes instead of single
ALERTS_BALANCES="[{\"accountAddress\":\"...\"}]"
```

**Issue**: Database connection failed
```bash
# Check database is running
docker ps | grep postgres

# Verify connection string
echo $DB_HOST $DB_PORT $DB_NAME

# Test connection
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME
```

### No Alerts Being Created

**Issue**: Config not loaded
- Check logs for "Config loaded from file"
- Verify `ALERTS_BALANCES`, `ALERTS_EVENTS`, or `ALERTS_QUEUES` are set
- Check config validation errors in logs
- Verify environment variables are exported (use `export ALERTS_BALANCES=...`)

**Issue**: Thresholds too high
- Verify account balances are actually below thresholds
- Check queue sizes manually via chain storage

**Issue**: Environment variables not passed to container
- In Docker: Verify `-e` flags or `--env-file` is used
- In Kubernetes: Check ConfigMap/Secret is mounted correctly
- Verify environment variables are visible inside container: `docker exec <container> env | grep ALERTS`

### Metrics Not Updating

**Issue**: Old alerts in database
```bash
# Clear old alerts
make reset
make migrate
make process
```

**Issue**: Metrics server not running
- Check logs for "Prometheus metrics server listening"
- Verify `METRICS_PORT` is not blocked
- Test endpoint: `curl http://localhost:3001/metrics`

### Balance Alerts Not Clearing

**Issue**: Old alert format in database
- Alerts created before schema update may not have `alertType`/`sourceIdentifier`
- Solution: Reset database or manually delete old alerts

```sql
DELETE FROM alert WHERE alert_type IS NULL;
```

### Environment Variable Issues

**Issue**: JSON parsing errors
```bash
# Validate JSON before setting
echo '[...]' | jq .

# Test in container
docker exec <container> sh -c 'echo $ALERTS_BALANCES | jq .'
```

**Issue**: Special characters in environment variables
- Use single quotes around JSON to prevent shell interpretation
- Escape inner quotes if needed: `'{"key":"value"}'`
- For Kubernetes, use `|` for multiline YAML strings

**Issue**: Environment variables not persisting
- In Docker Compose: Check `environment:` section
- In Kubernetes: Verify ConfigMap/Secret is created and referenced
- Restart pod/deployment after updating ConfigMap

## Architecture

### Service Layer

- **ConfigService**: Manages configuration loading and validation
- **ChainStorageService**: Abstracts blockchain storage queries
- **BalanceMonitoringService**: Monitors account balances
- **EventProcessingService**: Processes blockchain events
- **QueueMonitoringService**: Monitors storage queues

### Data Flow

```
Blockchain Archive → Processor → Services → Alert Creation → PostgreSQL
                                                      ↓
                                            Prometheus Metrics
```

### Alert Lifecycle

1. **Detection**: Service detects threshold breach
2. **Deduplication**: Check for existing active alert
3. **Creation**: Create alert with expiration timestamp
4. **Persistence**: Save to PostgreSQL
5. **Metrics Update**: Update Prometheus gauges
6. **Auto-Resolution**: Clear alert when condition returns to healthy

### Metrics Update Strategy

- **Incremental**: Updates only new alerts (fast, every block)
- **Full**: Rebuilds all metrics from database (every 100 blocks or on event alerts)
- **Force**: Manual full update on startup

## Development

### Project Structure

```
apps/alerts/
├── src/
│   ├── processor.ts              # Main entry point
│   ├── metrics-server.ts         # Prometheus HTTP server
│   ├── prometheus-metrics.ts     # Metrics definitions
│   ├── services/                 # Monitoring services
│   ├── model/                    # TypeORM entities
│   └── utils/                    # Utilities
├── schema.graphql                # Database schema
├── typegen/                      # Substrate typegen configs
└── env.example                   # Environment template
```

### Adding New Alert Types

1. Add service in `src/services/`
2. Register in `processor.ts`
3. Add Prometheus gauges in `prometheus-metrics.ts`
4. Update config types in `src/services/config/types.ts`

### Code Generation

```bash
# Generate TypeORM entities from schema
make codegen

# Generate Substrate types
make typegen-parachain
make typegen-testnet
```
