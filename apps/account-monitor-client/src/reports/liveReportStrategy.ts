import { IServiceDependencies, IReportParams, ReportStrategy } from '../reportService'

export class LiveReport implements ReportStrategy {
  private listener: ((record: any) => Promise<void>) | null = null

  constructor(private readonly dependencies: IServiceDependencies) {}

  async generateReport(params: IReportParams) {
    const { dbClient, messageSender } = this.dependencies
    const { token, minAmount, interestingAccounts, minVolume, minTransactions } = params

    const newRecordListener = async (record: any) => {
      try {
        if (token && record.token_id === token && record.amount >= minAmount) {
          await this.sendMessage(
            `Large transaction from account ${record.from}: ${record.amount} ${token}`,
            messageSender
          )
        }

        if (interestingAccounts.includes(record.from)) {
          const transactions = await this.getTransactions(record.from, dbClient)

          if (transactions.count >= minTransactions) {
            await this.sendMessage(
              `Account ${record.from} has made ${transactions.count} transactions`,
              messageSender
            )
          }

          if (transactions.sum >= minVolume) {
            await this.sendMessage(
              `Account ${record.from} has transferred ${transactions.amount}`,
              messageSender
            )
          }
        }
      } catch (error) {
        console.error(`Error generating live report: ${error}`)
      }
    }

    dbClient.on('new-record', newRecordListener)

    return () => {
      dbClient.removeListener('new-record', newRecordListener)
    }
  }

  start = () => {
    if (!this.listener) {
      throw new Error('Report not initialized. Call generateReport() first.')
    }

    this.dependencies.dbClient.on('new-record', this.listener)
  }

  stop = () => {
    if (!this.listener) {
      throw new Error('Report not initialized. Call generateReport() first.')
    }

    this.dependencies.dbClient.removeListener('new-record', this.listener)
  }

  private async getTransactions(account: string, dbClient: any) {
    const query = {
      text: 'SELECT COUNT(*), SUM(amount) FROM transfer WHERE "from" = $1',
      values: [account]
    }
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
