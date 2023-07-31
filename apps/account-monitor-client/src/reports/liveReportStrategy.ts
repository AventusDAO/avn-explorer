import DbClient, { DbEvents } from '../dbClient'
import { IServiceDependencies, IReportParams, ReportStrategy } from '../reportService'

interface IRecord {
  token_id?: string
  amount: bigint
  from: string
  to: string
}

interface ITransactions {
  count: number
  sum: bigint
  token_id: string
  amount: bigint
}

export class LiveReport implements ReportStrategy {
  private listener: ((record: IRecord) => Promise<void>) | null = null

  constructor(private readonly dependencies: IServiceDependencies) {}

  async generateReport(params: IReportParams): Promise<void> {
    const { dbClient, messageSender } = this.dependencies
    const { token, minAmount, interestingAccounts, minVolume, minTransactions } = params

    this.listener = async (record: IRecord): Promise<void> => {
      try {
        if (token && record.token_id === token && record.amount >= minAmount) {
          await this.sendMessage(
            `Large transaction from account ${record.from}: ${record.amount} ${token}`,
            messageSender
          )
        }

        if (interestingAccounts.includes(record.from) || interestingAccounts.includes(record.to)) {
          const transactions = await this.getTransactions(record.from, dbClient)

          if (transactions.count >= minTransactions) {
            await this.sendMessage(
              `Account ${record.from} has made ${transactions.count} transactions`,
              messageSender
            )
          }

          if (transactions.sum >= minVolume) {
            await this.sendMessage(
              `Account ${record.from} has traded ${transactions.amount} of token: ${
                transactions.token_id ?? 'AVT'
              }`,
              messageSender
            )
          }
        }
      } catch (error) {
        console.error(`Error generating live report: ${error}`)
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    dbClient.on(DbEvents.NEW_RECORD, this.listener)
  }

  start = async () => {
    if (!this.listener) {
      throw new Error('Report not initialized. Call generateReport() first.')
    }
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.dependencies.dbClient.on(DbEvents.NEW_RECORD, this.listener)
  }

  stop = async () => {
    if (!this.listener) {
      throw new Error('Report not initialized. Call generateReport() first.')
    }
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.dependencies.dbClient.removeListener(DbEvents.NEW_RECORD, this.listener)
  }

  private async getTransactions(account: string, dbClient: DbClient): Promise<ITransactions> {
    const query = `SELECT COUNT(*), SUM(amount), token_id FROM transfer WHERE "from" = ${account} OR "to" = ${account}`

    const result = await dbClient.query(query)

    return result.rows[0]
  }

  private async sendMessage(message: string, messageSender: Function) {
    try {
      await messageSender(message)
    } catch (error) {
      console.error(`Error sending message: ${error}`)
    }
  }
}
