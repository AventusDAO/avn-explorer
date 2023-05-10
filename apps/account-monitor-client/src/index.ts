import axios from 'axios'
import { config } from 'dotenv'
import { DbClient, IDbConfig } from './dbClient'
import ReportService from './reportService'
import { runCli } from './cli'
import { JobManager } from './job'

config()

export const dataSourceConfig: IDbConfig = {
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
