/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config('../env')
const { Client } = require('pg')

const client = new Client({
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  host: process.env.DB_HOST ?? 'localhost'
})

const dropTables = async schema => {
  console.log(`Dropping tables in ${schema} schema...`)

  const query = `SELECT schemaname, tablename FROM pg_tables WHERE schemaname = '${schema}';`
  const { rows: tables } = await client.query(query)

  for (const { schemaname, tablename } of tables) {
    const dropQuery = `DROP TABLE IF EXISTS ${schemaname}.${tablename};`
    await client.query(dropQuery)
  }

  console.log(`Done.`)
}

;(async () => {
  await client.connect()
  await dropTables('fees')
  await client.end()
})()
