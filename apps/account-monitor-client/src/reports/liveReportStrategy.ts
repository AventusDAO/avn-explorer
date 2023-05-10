import { IServiceDependencies, IReportParams, ReportStrategy } from '../reportService'

export class LiveReport implements ReportStrategy {
  constructor(private readonly dependencies: IServiceDependencies) {}

  async generateReport(params: IReportParams) {
    const { dbClient, messageSender } = this.dependencies
    const { token, minAmount, interestingAccounts, minVolume, minTransactions } = params

    dbClient.on('new-record', async (record: any) => {
      if (token && record.token_id === token && record.amount >= minAmount) {
        await messageSender(
          `Large transaction from account ${record.from}: ${record.amount} ${token}`
        )
      }

      if (interestingAccounts.includes(record.from)) {
        const transactions = await dbClient.query(
          `SELECT COUNT(*), SUM(amount) FROM transfer WHERE "from" = '${record.from}'`
        )

        if (transactions.rows[0].count >= minTransactions) {
          await messageSender(
            `Account ${record.from} has made ${transactions.rows[0].count} transactions`
          )
        }

        if (transactions.rows[0].sum >= minVolume) {
          await messageSender(`Account ${record.from} has transferred ${transactions.rows[0].sum}`)
        }
      }
    })
  }
}
