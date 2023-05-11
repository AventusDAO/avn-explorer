import { JobManager } from './job.js'
import ReportService, { ReportStrategyEnum } from './reportService.js'
import readline from 'readline'
import { TopVolumeMoveReport } from './reports/topAccountsVolumeStrategy.js'
import { LiveReport } from './reports/liveReportStrategy.js'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

export async function runCli(reportService: ReportService, reportManager: JobManager) {
  while (true) {
    console.log('What do you want to do?\n')
    const reportAction = await askQuestion([
      'Create new report',
      'List reports',
      'Stop report',
      'Remove report'
    ])

    switch (reportAction) {
      case 'Create new report':
        await handleCreateNewReport(reportService, reportManager)
        break
      case 'List reports':
        const list = reportManager.listJobs()
        if (Object.keys(list).length) {
          console.log(list)
        }
        break
      case 'Stop report':
      case 'Remove report':
        const jobId = await handleJobAction(reportManager)
        if (jobId !== null) {
          reportAction === 'Stop report'
            ? reportManager.stopJob(jobId)
            : reportManager.removeJob(jobId)
        }
        break
      default:
        console.log('Invalid action selected.')
    }
  }
}

async function createTopVolumeMovesReport(reportService: ReportService, reportManager: JobManager) {
  reportService.setReportStrategy(ReportStrategyEnum.TopVolumeMoveReport)
  const reportParams: any = {}

  reportService.setReportStrategy(ReportStrategyEnum.TopVolumeMoveReport)
  console.log('\nSelect the period for the report:\n')
  const period = await askQuestion(['Last 24 hours', 'Last 7 days', 'Last 30 days'])
  reportParams.period = period

  console.log('\nSelect the frequency for the report:\n')
  const frequency = await askQuestion(['Hourly', 'Daily', 'Weekly', 'Monthly', 'Every minute'])
  reportParams.frequency = getCronExpression(frequency)

  console.log('\nSelect the filter for the report:\n')
  const filterType = await askQuestion(['By Block Number', 'By Timestamp', 'No Filter'])

  if (filterType === 'By Block Number') {
    console.log('\nEnter the block number:\n')
    const blockNumber = await askQuestion([], true)
    reportParams.filter = { type: 'block_number', value: blockNumber }
  } else if (filterType === 'By Timestamp') {
    console.log('\nEnter the timestamp (YYYY-MM-DDTHH:MM:SS.SSSSSSZ):\n')
    const timestamp = await askQuestion([], true)
    reportParams.filter = { type: 'timestamp', value: timestamp }
  }

  console.log('\nDo you want to monitor a specific token?\n')
  const tokenChoice = await askQuestion(['Yes', 'No'])

  if (tokenChoice === 'Yes') {
    console.log('\nEnter the token ID:\n')
    const token = await askQuestion([], true)
    reportParams.token = token
  }

  const reportStrategy = new TopVolumeMoveReport(reportService.dependencies)
  reportManager.createNewJob(reportParams, reportStrategy)
}

async function handleCreateNewReport(reportService: ReportService, reportManager: JobManager) {
  const reportType = await askQuestion(['Top Volume Moves Report', 'Live Report'])
  switch (reportType) {
    case 'Top Volume Moves Report':
      await createTopVolumeMovesReport(reportService, reportManager)
      break
    case 'Live Report':
      await createLiveReport(reportService, reportManager)
      break
    default:
      console.log('Invalid report type selected.')
  }
}

async function createLiveReport(reportService: ReportService, reportManager: JobManager) {
  reportService.setReportStrategy(ReportStrategyEnum.LiveReport)
  const reportParams: any = {}

  reportService.setReportStrategy(ReportStrategyEnum.LiveReport)

  console.log('\nDo you want to monitor a specific token?\n')
  const tokenChoice = await askQuestion(['Yes', 'No'])
  let token = null
  if (tokenChoice === 'Yes') {
    console.log('\nEnter the token ID:\n')
    token = await askQuestion([], true)
  }
  reportParams.token = token

  console.log('\nEnter the minimum amount for a significant transaction:\n')
  const minAmount = await askQuestion([], true)
  reportParams.minAmount = Number(minAmount)

  console.log('\nEnter the accounts you are interested in (separated by commas):\n')
  const interestingAccounts = await askQuestion([], true)
  reportParams.interestingAccounts = interestingAccounts.split(',')

  console.log('\nEnter the minimum volume for account monitoring:\n')
  const minVolume = await askQuestion([], true)
  reportParams.minVolume = Number(minVolume)

  console.log('\nEnter the minimum number of transactions for account monitoring:\n')
  const minTransactions = await askQuestion([], true)
  reportParams.minTransactions = Number(minTransactions)

  const reportStrategy = new LiveReport(reportService.dependencies)
  reportManager.createNewJob(reportParams, reportStrategy)
}

async function handleJobAction(reportManager: JobManager) {
  const list = reportManager.listJobs()
  if (!Object.keys(list).length) {
    return null
  }
  console.log('\nWhich job do you want to action?\n')
  const jobId = await askQuestion(Object.keys(list))
  return parseInt(jobId)
}

async function askQuestion(choices: string[], freeText: boolean = false): Promise<string> {
  const choicesMessage = choices.length
    ? choices.map((choice, index) => `${index + 1}. ${choice}`).join('\n') + '\n'
    : ''

  return await new Promise<string>(resolve => {
    return rl.question(choicesMessage, (answer: string) => {
      if (freeText) {
        // If freeText is enabled, resolve with the raw answer
        resolve(answer)
      } else {
        const index = parseInt(answer) - 1
        if (!isNaN(index) && index >= 0 && index < choices.length) {
          resolve(choices[index])
        } else if (choices.includes(answer)) {
          resolve(answer)
        } else {
          console.log(`Invalid choice. Please choose one of: ${choices.join(', ')}\n`)
          const newAnswer = askQuestion(choices)
          resolve(newAnswer)
        }
      }
    })
  })
}

function getCronExpression(frequency: string): string {
  switch (frequency) {
    case 'Hourly':
      return '0 * * * *'
    case 'Daily':
      return '0 0 * * *'
    case 'Weekly':
      return '0 0 * * 0'
    case 'Monthly':
      return '0 0 1 * *'
    case 'Every minute':
      return '*/1 * * * *'
    default:
      return ''
  }
}
