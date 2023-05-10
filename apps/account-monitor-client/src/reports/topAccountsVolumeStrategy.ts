import { IReportParams, IServiceDependencies, ReportStrategy } from '../reportService'

export class TopVolumeMoveReport implements ReportStrategy {
  constructor(private readonly dependencies: IServiceDependencies) {}

  private constructQuery(params: IReportParams): string {
    const { token, filter } = params
    const filters = [
      `token_id is not null`,
      token && `token_id = '${token}'`,
      filter?.type === 'timestamp' && `"timestamp" >= '${filter.value}'`,
      filter?.type === 'block_number' && `block_number >= ${filter.value}`
    ]
      .filter(Boolean)
      .join(' and ')

    return `
        select 
          sum(amount), 
          "from",
          token_id
        from transfer 
        where ${filters}
        group by token_id, "from"
        order by sum(amount) desc 
        limit 10
      `
  }

  async generateReport(params: IReportParams) {
    const { dbClient, messageSender } = this.dependencies
    const query = this.constructQuery(params)

    const res = await dbClient.query(query)
    const report = JSON.stringify(
      res.rows.map((entry: any, index: number) => ({
        index: index + 1,
        ...entry
      })),
      null,
      '\t'
    )

    await messageSender(report)
  }
}
