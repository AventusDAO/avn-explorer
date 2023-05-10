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
    const dropQuery = `DROP TABLE IF EXISTS ${schemaname}.${tablename} CASCADE;`
    console.log(`Dropping ${schemaname}.${tablename}`)
    await client.query(dropQuery)
  }
}

const clearDatabase = async (config: DatabaseConfig) => {
  const { db, reset, user, pass } = config

  if (!reset) return

  if (!db) throw new Error('Missing db env var')
  if (!user || !pass) throw new Error('Missing user or pass env var')

  const client = new Client({
    user,
    password: pass,
    database: db,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST
  })

  if (config.name === 'search') {
    const { esUrl, esBlocksIndex, esExtrinsicsIndex, esEventsIndex } = config
    if (esUrl && esBlocksIndex && esExtrinsicsIndex && esEventsIndex) {
      console.log('Clearing ElasticSearch indices...')
      const endpoints = [esBlocksIndex, esExtrinsicsIndex, esEventsIndex].map(e => `${esUrl}/${e}`)
      const deleteRequests = endpoints.map(async e => await fetch(e, { method: 'DELETE' }))
      await Promise.all(deleteRequests)
    }
  }

  console.log(`Connecting user to ${db}...`)
  await client.connect()

  await clearSchemaTables('public', client)
  await clearSchemaTables('squid_processor', client)

  console.log(`Done clearing ${db}.`)
  await client.end()
}

const main = async () => {
  const schemaConfigs = getDbConfigs()
  console.log(
    'Config: ',
    schemaConfigs.map(({ reset, db }) => ({
      db,
      reset
    }))
  )

  for (const config of schemaConfigs) {
    await clearDatabase(config)
  }
}

void main()
