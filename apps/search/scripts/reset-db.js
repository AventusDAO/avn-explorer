/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config('.env')
const { Client } = require('pg')

const client = new Client({
  user: 'postgres',
  database: 'postgres',
  password: 'postgres',
  port: process.env.DB_PORT,
  host: 'localhost'
})

const dropEs = async () => {
  console.log(`Removing ElasticSearch indices...`)
  const { ES_URL, ES_BLOCKS_INDEX, ES_EXTRINSICS_INDEX, ES_EVENTS_INDEX } = process.env
  if (ES_URL && ES_BLOCKS_INDEX && ES_EXTRINSICS_INDEX && ES_EVENTS_INDEX) {
    console.log('Clearing ElasticSearch indices...')
    const endpoints = [ES_BLOCKS_INDEX, ES_EXTRINSICS_INDEX, ES_EVENTS_INDEX].map(
      e => `${ES_URL}/${e}`
    )
    const deleteRequests = endpoints.map(async e => await fetch(e, { method: 'DELETE' }))
    await Promise.all(deleteRequests)
  }
  console.log(`Removed.`)
}

const dropDb = async () => {
  console.log(`Dropping ${process.env.DB_NAME}...`)
  const _res = await client.query(`DROP DATABASE "${process.env.DB_NAME}"`)
  console.log(`Dropped.`)
}

const createDb = async () => {
  console.log(`Creating ${process.env.DB_NAME}...`)
  const _res = await client.query(`CREATE DATABASE "${process.env.DB_NAME}"`)
  console.log(`Created.`)
}

;(async () => {
  await client.connect()
  await dropDb()
  await createDb()
  await client.end()
  await dropEs()
})()
