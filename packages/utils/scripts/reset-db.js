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

const dropDb = async () => {
  console.log(`Dropping ${process.env.DB_NAME}...`)
  const _res = await client.query(`DROP DATABASE IF EXISTS "${process.env.DB_NAME}"`)
  console.log(`Dropped ${process.env.DB_NAME}.`)
}

const createDb = async () => {
  console.log(`Creating ${process.env.DB_NAME}...`)
  const _res = await client.query(`CREATE DATABASE "${process.env.DB_NAME}"`)
  console.log(`Created ${process.env.DB_NAME}.`)
}

;(async () => {
  await client.connect()
  await dropDb()
  await createDb()
  await client.end()
})()
