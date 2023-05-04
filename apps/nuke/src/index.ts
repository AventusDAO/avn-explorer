/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-var-requires */
import { SchemaConfig, getSchemaConfigs } from './config'
const { Client } = require('pg')
require('dotenv').config('../env')

const clearSchema = async (config: SchemaConfig) => {
  const { schema, reset, user, pass } = config

  if (!reset) return

  if (!schema) throw new Error('Missing schema env var')
  if (!user || !pass) throw new Error('Missing user or pass env var')

  const client = new Client({
    user: config.user,
    password: config.pass,
    database: process.env.DB_NAME,
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

  console.log(`Connecting user to ${schema} schema...`)
  await client.connect()

  const query = `SELECT schemaname, tablename FROM pg_tables WHERE schemaname = '${schema}';`
  const { rows: tables } = await client.query(query)

  for (const { schemaname, tablename } of tables) {
    const dropQuery = `DROP TABLE IF EXISTS ${schemaname}.${tablename} CASCADE;`
    console.log(`Dropping ${schemaname}.${tablename}`)
    await client.query(dropQuery)
  }

  console.log(`Done clearing ${schema} schema.`)
  await client.end()
}

const main = async () => {
  const schemaConfigs = getSchemaConfigs()
  console.log(
    'Config: ',
    schemaConfigs.map(({ reset, schema }) => ({
      schema,
      reset
    }))
  )

  for (const config of schemaConfigs) {
    await clearSchema(config)
  }
}

void main()
