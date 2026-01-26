/**
 * Database initialization script for squid deployments.
 *
 * This script connects to PostgreSQL using admin credentials and creates
 * the required database and role if they don't exist.
 *
 * Environment variables:
 * - DB_ADMIN_USER: Admin username (required for DB creation)
 * - DB_ADMIN_PASS: Admin password (required for DB creation)
 * - DB_NAME: Target database name to create
 * - DB_USER: Target role name to create
 * - DB_PASS: Target role password
 *
 * If DB_ADMIN_USER is not set, the script skips initialization gracefully.
 */

const { Client } = require("pg");

async function initDatabase() {
  const adminHost = process.env.DB_HOST || "localhost";
  const adminPort = process.env.DB_PORT || "5432";
  const adminUser = process.env.DB_ADMIN_USER;
  const adminPass = process.env.DB_ADMIN_PASS;

  const dbName = process.env.DB_NAME;
  const dbUser = process.env.DB_USER;
  const dbPass = process.env.DB_PASS;

  // Skip if no admin credentials provided (useful for local dev)
  if (!adminUser || !adminPass) {
    console.log("[init-db] No admin credentials provided (DB_ADMIN_USER/DB_ADMIN_PASS), skipping DB initialization");
    return;
  }

  if (!dbName || !dbUser || !dbPass) {
    console.error("[init-db] Missing required environment variables: DB_NAME, DB_USER, DB_PASS");
    process.exit(1);
  }

  console.log(`[init-db] Connecting to PostgreSQL at ${adminHost}:${adminPort} as admin user`);

  const client = new Client({
    host: adminHost,
    port: parseInt(adminPort, 10),
    user: adminUser,
    password: adminPass,
    database: "postgres", // Connect to default DB first
  });

  try {
    await client.connect();
    console.log("[init-db] Connected to PostgreSQL");

    // Check if role exists
    const roleResult = await client.query(
      "SELECT 1 FROM pg_catalog.pg_roles WHERE rolname = $1",
      [dbUser]
    );

    if (roleResult.rowCount === 0) {
      console.log(`[init-db] Creating role: ${dbUser}`);
      // Use format to safely escape the identifier and password
      await client.query(`CREATE ROLE "${dbUser}" WITH LOGIN PASSWORD '${dbPass.replace(/'/g, "''")}'`);
      console.log(`[init-db] Role ${dbUser} created successfully`);
    } else {
      console.log(`[init-db] Role ${dbUser} already exists`);
    }

    // Check if database exists
    const dbResult = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [dbName]
    );

    if (dbResult.rowCount === 0) {
      console.log(`[init-db] Creating database: ${dbName}`);
      // Create database without owner first to avoid SET ROLE requirement
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`[init-db] Database ${dbName} created successfully`);
    } else {
      console.log(`[init-db] Database ${dbName} already exists`);
    }

    // Ensure privileges and ownership are set (idempotent operations)
    console.log(`[init-db] Ensuring privileges for ${dbUser} on ${dbName}`);
    await client.query(`GRANT ALL PRIVILEGES ON DATABASE "${dbName}" TO "${dbUser}"`);
    // Set owner after database creation to avoid SET ROLE requirement during CREATE
    await client.query(`ALTER DATABASE "${dbName}" OWNER TO "${dbUser}"`);

    console.log("[init-db] Database initialization completed successfully");
  } catch (error) {
    console.error("[init-db] Error during database initialization:", error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run the initialization
initDatabase().catch((error) => {
  console.error("[init-db] Unexpected error:", error);
  process.exit(1);
});
