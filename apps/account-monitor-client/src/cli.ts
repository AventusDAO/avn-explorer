import { JobManager } from './job.js'
import ReportService, { ReportStrategyEnum } from './reportService.js'
import readline from 'readline'

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

    if (reportAction === 'Create new report') {
      console.log('Which type of report would you like to generate?\n')
      const reportType = await askQuestion(['Top Volume Moves Report', 'Live Report'])
      if (reportType === 'Top Volume Moves Report') {
        await createTopVolumeMovesReport(reportService, reportManager)
      } else if (reportType === 'Live Report') {
        await createLiveReport(reportService)
      }
    } else if (reportAction === 'List reports') {
      const list = reportManager.listJobs()
      if (!Object.keys(list).length) {
        continue
      }
      console.log(list)
    } else if (reportAction === 'Stop report') {
      const list = reportManager.listJobs()
      if (!Object.keys(list).length) {
        continue
      }
      console.log('\nWhich job do you want to stop?\n')
      const jobId = await askQuestion(Object.keys(list))
      reportManager.stopJob(parseInt(jobId))
    } else if (reportAction === 'Remove report') {
      const list = reportManager.listJobs()
      if (!Object.keys(list).length) {
        continue
      }
      console.log('\nWhich job do you want to stop?\n')
      const jobId = await askQuestion(Object.keys(list))
      reportManager.removeJob(parseInt(jobId))
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

  reportManager.createNewJob(reportParams, reportService.generateReport)
}

// New function for Live Report
async function createLiveReport(reportService: ReportService) {
  reportService.setReportStrategy(ReportStrategyEnum.LiveReport)
  const reportParams: any = {}

  reportService.setReportStrategy(ReportStrategyEnum.LiveReport)
  await reportService.generateReport(reportParams)
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
