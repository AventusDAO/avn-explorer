# Database Scripts

Utility scripts for PostgreSQL database management.

## Scripts

### init-db.js

Initializes a PostgreSQL database and role for squid deployments. This script is idempotent and safe to run multiple times.

**Features:**
- Creates role if it doesn't exist
- Creates database if it doesn't exist
- Grants privileges and sets ownership
- Skips gracefully when no admin credentials are provided (useful for local dev)

**Environment Variables:**

| Variable | Required | Description |
|----------|----------|-------------|
| `DB_ADMIN_HOST` | No | Admin connection host (defaults to `DB_HOST` or `localhost`) |
| `DB_ADMIN_PORT` | No | Admin connection port (defaults to `DB_PORT` or `5432`) |
| `DB_ADMIN_USER` | Yes* | Admin username with CREATE DATABASE/ROLE privileges |
| `DB_ADMIN_PASS` | Yes* | Admin password |
| `DB_NAME` | Yes | Target database name to create |
| `DB_USER` | Yes | Target role name to create |
| `DB_PASS` | Yes | Target role password |

*If `DB_ADMIN_USER` and `DB_ADMIN_PASS` are not set, the script skips initialization. This is useful for local development where docker-compose creates the database automatically.

**Usage:**

```bash
# With dotenv (from an app directory)
node -r dotenv/config ../../packages/utils/scripts/init-db.js

# With environment variables directly
DB_ADMIN_USER=postgres DB_ADMIN_PASS=secret DB_NAME=mydb DB_USER=myuser DB_PASS=mypass node init-db.js
```

### reset-db.js

Drops and recreates a database. **Use with caution** - this destroys all data.

**Environment Variables:**

| Variable | Required | Description |
|----------|----------|-------------|
| `DB_PORT` | Yes | PostgreSQL port |
| `DB_NAME` | Yes | Database name to reset |

**Usage:**

```bash
node -r dotenv/config reset-db.js
```

> **Warning:** This script uses hardcoded local credentials (`postgres`/`postgres`) and is intended for local development only.
