/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-var-requires */
import { DatabaseConfig, getDbConfigs } from './config'
const { Client } = require('pg')
require('dotenv').config('../env')

const clearSchemaTables = async (schemaName: string, client: typeof Client) => {
  const query = `SELECT schemaname, tablename FROM pg_tables WHERE schemaname = '${schemaName}';`
  const { rows: tables } = await client.query(query)

  for (const { schemaname, tablename } of tables) {
    const dropQuery = `DROP TABLE ${schemaname}.${tablename} CASCADE;`
    console.log(`Dropping ${schemaname}.${tablename}`)
    await client.query(dropQuery)
  }
}

const resetProcessorHeight = async (config: DatabaseConfig, client: typeof Client) => {
  try {
    // Check if status table exists
    const checkTableQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'status'
      );
    `
    const { rows } = await client.query(checkTableQuery)
    const tableExists = rows[0]?.exists

    if (!tableExists) {
      throw new Error(`Table status does not exist in ${config.db}`)
    }

    // Reset height to 0
    const updateQuery = `UPDATE squid_processor.status SET height = 0;`
    console.log(`Resetting height to 0 in ${config.db}...`)
    await client.query(updateQuery)
    console.log(`Height reset complete for ${config.db}`)
  } catch (error) {
    console.error(`Error resetting height for ${config.db}:`, error)
    throw error
  }
}

const clearDatabase = async (config: DatabaseConfig) => {
  const { db, reset, resetHeight, user, pass } = config

  // Skip if neither reset nor resetHeight is enabled
  if (!reset && !resetHeight) return

  if (!db) throw new Error('Missing db env var')
  if (!user || !pass) throw new Error('Missing user or pass env var')

  const client = new Client({
    user,
    password: pass,
    database: db,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST
  })

  try {
    // Handle ElasticSearch index cleanup for search service
    if (config.name === 'search' && config.resetIndexes === true) {
      const { esUrl, esBlocksIndex, esExtrinsicsIndex, esEventsIndex } = config
      if (esUrl && esBlocksIndex && esExtrinsicsIndex && esEventsIndex) {
        console.log('Clearing ElasticSearch indices...')
        const endpoints = [esBlocksIndex, esExtrinsicsIndex, esEventsIndex].map(
          e => `${esUrl}/${e}`
        )
        try {
          const deleteRequests = endpoints.map(async e => {
            const response = await fetch(e, { method: 'DELETE' })
            if (!response.ok) {
              console.warn(`Failed to delete index ${e}: ${response.statusText}`)
            }
            return response
          })
          await Promise.all(deleteRequests)
          console.log('ElasticSearch indices cleared successfully')
        } catch (error) {
          console.error('Error clearing ElasticSearch indices:', error)
          throw error
        }
      }
    }

    console.log(`Connecting user to ${db}...`)
    await client.connect()

    // Reset height if requested and not dropping tables (since dropping makes height reset redundant)
    if (resetHeight && !reset) {
      await resetProcessorHeight(config, client)
    }

    // Drop all tables if reset is enabled
    if (reset) {
      await clearSchemaTables('public', client)
      await clearSchemaTables('squid_processor', client)
      console.log(`Done clearing ${db}.`)
    }

    await client.end()
  } catch (error) {
    console.error(`Error processing ${db}:`, error)
    try {
      await client.end()
    } catch (endError) {
      console.error(`Error closing connection for ${db}:`, endError)
    }
    throw error
  }
}

const main = async () => {
  const schemaConfigs = getDbConfigs()
  console.log(
    'Config: ',
    schemaConfigs.map(({ reset, resetHeight, db }) => ({
      db,
      reset,
      resetHeight
    }))
  )

  for (const config of schemaConfigs) {
    await clearDatabase(config)
  }
}

void main()
