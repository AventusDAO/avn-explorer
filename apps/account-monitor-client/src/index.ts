import axios from 'axios'
import { config } from 'dotenv'
import { DbClient } from './dbClient.js'
import ReportService from './reportService.js'
import { runCli } from './cli.js'
import { JobManager } from './job.js'

config()

export const dataSourceConfig = {
  port: parseInt(process.env.DB_PORT ?? '5432'),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
}

async function messageSender(msg: string) {
  if (process.env.SLACK_APP_URL) await axios.post(process.env.SLACK_APP_URL, { text: msg })
}

async function main() {
  try {
    const dbClient = new DbClient(dataSourceConfig)
    await dbClient.connect()
    const dependencies = { dbClient, messageSender }
    const reportManager = new JobManager()
    const reportService = new ReportService(dependencies)
    await runCli(reportService, reportManager)
  } catch (err) {
    console.error(err)
  }
}

void (async () => {
  try {
    await main()
  } catch (error) {
    console.error(error)
  }
})()
