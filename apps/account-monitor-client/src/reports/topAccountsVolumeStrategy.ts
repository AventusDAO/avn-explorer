import { DbClient } from '../dbClient'

export interface ReportParams {
  period: string
  frequency: string
  token?: string
  filter?: { type: string; value: string }
}

export interface IServiceDependencies {
  dbClient: DbClient
  messageSender: (msg: string) => Promise<void>
}

export interface ReportStrategy {
  generateReport: (params: ReportParams) => Promise<void>
}

export class TopVolumeMoveReport implements ReportStrategy {
  constructor(private readonly dependencies: IServiceDependencies) {}

  async generateReport(params: ReportParams) {
    const { dbClient, messageSender } = this.dependencies
    const { period, frequency, token, filter } = params

    const dateFilter = filter?.type === 'timestamp' ? ` and "timestamp" > '${filter.value}'` : ''
    const blockNumberFilter =
      filter?.type === 'block_number' ? ` and block_number > ${filter.value}` : ''

    let query = `
        select 
          sum(amount), 
          from_id as from_address,
          token_id
        from transfer 
        where 1 = 1
          and token_id is not null
          ${dateFilter}
          ${blockNumberFilter}
      `

    if (token) {
      query += ` and token_id = '${token}'`
    }

    query += `
        group by from_id, token_id 
        order by sum(amount) desc 
        limit 10
      `

    const res = await dbClient.query(query)
    await messageSender(
      JSON.stringify(
        res.rows.map((entry: any, index: number) => {
          const idx = index + 1
          return { index: idx, ...entry }
        }),
        null,
        '\t'
      )
    )
  }
}
