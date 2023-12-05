import { EntityManager } from 'typeorm'

export class TokenTransferService {
  constructor(private readonly manager: EntityManager) {}

  private formatDateForQuery(date: Date): string {
    return date.toISOString()
  }

  private async executeAggregateQuery(
    query: string,
    params: any[],
    output: string
  ): Promise<bigint> {
    try {
      const result = await this.manager.query(query, params)
      return BigInt(result?.[0]?.[output] ?? 0)
    } catch (error) {
      console.error('Error executing aggregate query:', error)
      throw new Error('Error executing database operation')
    }
  }

  private buildSumQuery(method: string, isNegative: boolean = false): string {
    return `SUM(CASE WHEN method = '${method}' THEN amount ELSE 0 END) ${isNegative ? '-' : ''} `
  }

  private buildCommonQuery(tokenId: string, accountId?: string): string {
    let query = `
      SELECT 
        ${this.buildSumQuery('TokenLifted', true)}
        ${this.buildSumQuery('TokenLowered')}
        AS totalAmount
      FROM token_transfer
      WHERE token_id = $1
        AND method IN ('TokenLifted', 'TokenLowered')
    `

    if (accountId) {
      query += ` AND (from_id = $2 OR to_id = $2)`
    }

    return query
  }

  async getTotalAmountByToken(tokenId: string): Promise<bigint> {
    const query = this.buildCommonQuery(tokenId)
    return await this.executeAggregateQuery(query, [tokenId], 'totalamount')
  }

  async getTotalAmountByAccountAndToken(accountId: string, tokenId: string): Promise<bigint> {
    const query = this.buildCommonQuery(tokenId, accountId)
    return await this.executeAggregateQuery(query, [accountId, tokenId], 'totalamount')
  }

  async getAverageAmountLastNDays(n: number, tokenId: string, accountId?: string): Promise<bigint> {
    const dateAgo = this.formatDateForQuery(new Date(Date.now() - n * 24 * 60 * 60 * 1000))
    let query = `
      SELECT AVG(${this.buildSumQuery('TokenLifted', true)}
        ${this.buildSumQuery('TokenLowered')}
) as averageAmount
      FROM token_transfer
      WHERE token_id = $1
        AND timestamp >= $2
    `

    const params = [tokenId, dateAgo]
    if (accountId) {
      query += ` AND (from_id = $3 OR to_id = $3)`
      params.push(accountId)
    }

    return await this.executeAggregateQuery(query, params, 'averageamount')
  }

  async getTotalLoweredAmountByToken(tokenId: string): Promise<bigint> {
    const query = `
      SELECT SUM(amount) as totalAmount
      FROM token_transfer
      WHERE token_id = $1 AND method = 'TokenLowered'
    `

    return await this.executeAggregateQuery(query, [tokenId], 'totalamount')
  }

  async getTotalLiftedAmountByToken(tokenId: string): Promise<bigint> {
    const query = `
      SELECT SUM(amount) as totalAmount
      FROM token_transfer
      WHERE token_id = $1 AND method = 'TokenLifted'
    `

    return await this.executeAggregateQuery(query, [tokenId], 'totalamount')
  }

  async getTotalAvtLoweredAmount(): Promise<bigint> {
    const query = `
      SELECT SUM(amount) as totalAmount
      FROM token_transfer
      WHERE method = 'AvtLowered'
    `

    return await this.executeAggregateQuery(query, [], 'totalamount')
  }

  async getTotalAvtLiftedAmount(): Promise<bigint> {
    const query = `
      SELECT SUM(amount) as totalAmount
      FROM token_transfer
      WHERE method = 'AVTLifted'
    `

    return await this.executeAggregateQuery(query, [], 'totalamount')
  }

  async countTokenTransactionsByMethodForPeriod(
    tokenId: string,
    startDate: string,
    endDate: string
  ): Promise<any[]> {
    const query = `
      SELECT method, COUNT(*) as count
      FROM token_transfer
      WHERE timestamp >= $1
        AND timestamp < $2
        AND token_id = $3
      GROUP BY method
    `

    const result = await this.manager.query(query, [startDate, endDate, tokenId])
    return result
  }
}
