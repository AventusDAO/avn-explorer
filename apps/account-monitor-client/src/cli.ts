import { JobManager } from './job.js'
import ReportService, { ReportStrategyEnum } from './reportService.js'
import readline from 'readline'
import { TopVolumeMoveReport } from './reports/topAccountsVolumeStrategy.js'
import { LiveReport } from './reports/liveReportStrategy.js'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

export async function runCli(
  reportService: ReportService,
  reportManager: JobManager
): Promise<void> {
  while (true) {
    const reportAction = await askQuestion('What do you want to do?', [
      'Create new report',
      'List reports',
      'Stop report',
      'Remove report'
    ])

    switch (reportAction) {
      case 'Create new report': {
        await handleCreateNewReport(reportService, reportManager)
        break
      }
      case 'List reports': {
        const list = reportManager.listJobs()
        if (Object.keys(list).length) {
          console.log(list)
        }
        break
      }

      case 'Remove report': {
        const jobId = await handleJobAction(reportManager)
        if (jobId !== null) {
          reportAction === 'Stop report'
            ? reportManager.stopJob(jobId)
            : reportManager.removeJob(jobId)
        }
        break
      }
      default:
        console.log('Invalid action selected.')
    }
  }
}

async function createTopVolumeMovesReport(
  reportService: ReportService,
  reportManager: JobManager
): Promise<void> {
  reportService.setReportStrategy(ReportStrategyEnum.TopVolumeMoveReport)
  const reportParams: any = {}

  reportService.setReportStrategy(ReportStrategyEnum.TopVolumeMoveReport)
  const period = await askQuestion('Select the period for the report:', [
    'Last 24 hours',
    'Last 7 days',
    'Last 30 days'
  ])
  reportParams.period = period

  const frequency = await askQuestion('Select the frequency for the report:', [
    'Hourly',
    'Daily',
    'Weekly',
    'Monthly',
    'Every minute'
  ])
  reportParams.frequency = getCronExpression(frequency)

  const filterType = await askQuestion('Select the filter for the report:', [
    'By Block Number',
    'By Timestamp',
    'No Filter'
  ])

  if (filterType === 'By Block Number') {
    const blockNumber = await askQuestion('Enter the block number:', [], true)
    reportParams.filter = { type: 'block_number', value: blockNumber }
  } else if (filterType === 'By Timestamp') {
    console.log()
    const timestamp = await askQuestion(
      'Enter the timestamp (YYYY-MM-DDTHH:MM:SS.SSSSSSZ):',
      [],
      true
    )
    reportParams.filter = { type: 'timestamp', value: timestamp }
  }

  const tokenChoice = await askQuestion('Do you want to monitor a specific token?', ['Yes', 'No'])

  if (tokenChoice === 'Yes') {
    console.log()
    const token = await askQuestion('Enter the token ID:', [], true)
    reportParams.token = token
  }

  const reportStrategy = new TopVolumeMoveReport(reportService.dependencies)
  await reportManager.createNewJob(reportParams, reportStrategy)
}

async function handleCreateNewReport(
  reportService: ReportService,
  reportManager: JobManager
): Promise<void> {
  const reportType = await askQuestion('Which type of report do you want:', [
    'Top Volume Moves Report',
    'Live Report'
  ])
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

async function createLiveReport(
  reportService: ReportService,
  reportManager: JobManager
): Promise<void> {
  reportService.setReportStrategy(ReportStrategyEnum.LiveReport)
  const reportParams: any = {}

  reportService.setReportStrategy(ReportStrategyEnum.LiveReport)

  const tokenChoice = await askQuestion('Do you want to monitor a specific token?', ['Yes', 'No'])
  let token = null
  if (tokenChoice === 'Yes') {
    token = await askQuestion('Enter the token ID:', [], true)
  }
  reportParams.token = token

  console.log()
  const minAmount = await askQuestion(
    'Enter the minimum amount for a significant transaction:',
    [],
    true
  )
  reportParams.minAmount = Number(minAmount)

  const interestingAccounts = await askQuestion(
    'Enter the accounts you are interested in (separated by commas):',
    [],
    true
  )
  reportParams.interestingAccounts = interestingAccounts.split(',')

  const minVolume = await askQuestion('Enter the minimum volume for account monitoring:', [], true)
  reportParams.minVolume = Number(minVolume)

  const minTransactions = await askQuestion(
    'Enter the minimum number of transactions for account monitoring:',
    [],
    true
  )
  reportParams.minTransactions = Number(minTransactions)

  const reportStrategy = new LiveReport(reportService.dependencies)
  await reportManager.createNewJob(reportParams, reportStrategy)
}

async function handleJobAction(reportManager: JobManager) {
  const list = reportManager.listJobs()
  if (!Object.keys(list).length) {
    return null
  }
  const jobId = await askQuestion('Which job do you want to action?', Object.keys(list))
  return parseInt(jobId)
}

async function askQuestion(
  question: string,
  choices: string[],
  freeText: boolean = false
): Promise<string> {
  console.log(`\n${question}\n`)
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
          console.log()
          const newAnswer = askQuestion(
            `Invalid choice. Please choose one of: ${choices.join(', ')}\n`,
            choices
          )
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
