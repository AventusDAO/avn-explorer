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
- Load configuration from environment variables or config file
- Connect to the chain archive
- Start processing blocks
- Expose metrics at `http://localhost:3001/metrics`

## Configuration

### Environment Variables

The processor supports multiple configuration methods (in priority order):

#### Option 1: Separate Environment Variables (Recommended)

```bash
# Balance monitoring
ALERTS_BALANCES='[{"accountAddress":"5GR39XQv4pAMyJHh9qUUi21cnMqgGD4RYidbJLv8D5fTB7Zh","prometheusTags":"environment=dev,network=aventus,account_type=anchoring,priority=critical","warningThreshold":"1000000000000000000","dangerThreshold":"500000000000000000"}]'

# Event monitoring
ALERTS_EVENTS='[{"eventName":"Summary.RootPassedValidation","prometheusTags":"environment=dev,network=aventus,type=info","includeMetadata":true}]'

# Queue monitoring
ALERTS_QUEUES='[{"queueName":"EthBridge.RequestQueue","prometheusTags":"environment=dev,network=aventus,type=bridge","warningThreshold":"10","errorThreshold":"50"}]'
```

#### Option 2: Single JSON Environment Variable

```bash
ALERTS_CONFIG_JSON='{"balances":[...],"events":[...],"queues":[...]}'
```

#### Option 3: Config File Path

```bash
ALERTS_CONFIG_PATH=/path/to/alerts-config.json
```

### Configuration Schema

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

#### Queue Configuration

```typescript
{
  queueName: string            // Format: "Section.StorageName" (e.g., "EthBridge.RequestQueue")
  prometheusTags: string
  warningThreshold: string    // Integer string
  errorThreshold: string      // Integer string
}
```

### Required Environment Variables

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

# Verify environment variables
cat .env | grep ALERTS_
```

**Issue**: Database connection failed
```bash
# Check database is running
docker ps | grep postgres

# Verify connection string
echo $DB_HOST $DB_PORT $DB_NAME
```

### No Alerts Being Created

**Issue**: Config not loaded
- Check logs for "Config loaded from file"
- Verify `ALERTS_BALANCES`, `ALERTS_EVENTS`, or `ALERTS_QUEUES` are set
- Check config validation errors in logs

**Issue**: Thresholds too high
- Verify account balances are actually below thresholds
- Check queue sizes manually via chain storage

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

### Balance Alerts Not Clearing

**Issue**: Old alert format in database
- Alerts created before schema update may not have `alertType`/`sourceIdentifier`
- Solution: Reset database or manually delete old alerts

```sql
DELETE FROM alert WHERE alert_type IS NULL;
```

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
