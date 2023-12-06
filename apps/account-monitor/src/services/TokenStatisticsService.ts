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

  private buildSumQuery(method: string): string {
    return `SUM(CASE WHEN method = '${method}' THEN amount ELSE 0 END)`
  }

  private buildCommonQuery(tokenId: string, accountId?: string): string {
    let query = `
      SELECT 
        ${this.buildSumQuery('TokenLifted')} -
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
    return await this.executeAggregateQuery(query, [tokenId], 'totalAmount')
  }

  async getTotalAmountByAccountAndToken(accountId: string, tokenId: string): Promise<bigint> {
    const query = this.buildCommonQuery(tokenId, accountId)
    return await this.executeAggregateQuery(query, [accountId, tokenId], 'totalAmount')
  }

  async getAverageAmountLastNDays(n: number, tokenId: string, accountId?: string): Promise<bigint> {
    const dateAgo = this.formatDateForQuery(new Date(Date.now() - n * 24 * 60 * 60 * 1000))

    let query = `
    SELECT AVG(totalAmount) as averageAmount
    FROM (
        SELECT
          ${this.buildSumQuery('TokenLifted')} -
          ${this.buildSumQuery('TokenLowered')} as totalAmount
        FROM token_transfer
        WHERE token_id = $1
          AND timestamp >= $2
    ) as subquery
    `

    const params = [tokenId, dateAgo]
    if (accountId) {
      query += ` AND (from_id = $3 OR to_id = $3)`
      params.push(accountId)
    }

    return await this.executeAggregateQuery(query, params, 'averageAmount')
  }

  async getTotalLoweredAmountByToken(tokenId: string): Promise<bigint> {
    const query = `
      SELECT SUM(amount) as totalAmount
      FROM token_transfer
      WHERE token_id = $1 AND method = 'TokenLowered' AND token_id != '0x0d88ed6e74bbfd96b831231638b66c05571e824f'
    `

    return await this.executeAggregateQuery(query, [tokenId], 'totalAmount')
  }

  async getTotalLiftedAmountByToken(tokenId: string): Promise<bigint> {
    const query = `
      SELECT SUM(amount) as totalAmount
      FROM token_transfer
      WHERE token_id = $1 AND method = 'TokenLifted' AND token_id != '0x0d88ed6e74bbfd96b831231638b66c05571e824f'
    `

    return await this.executeAggregateQuery(query, [tokenId], 'totalAmount')
  }

  async getTotalAvtLoweredAmount(): Promise<bigint> {
    const query = `
      SELECT SUM(amount) as totalAmount
      FROM token_transfer
      WHERE method = 'AvtLowered' OR (method = 'TokenLowered' AND token_id = '0x0d88ed6e74bbfd96b831231638b66c05571e824f')
    `

    return await this.executeAggregateQuery(query, [], 'totalAmount')
  }

  async getTotalAvtLiftedAmount(): Promise<bigint> {
    const query = `
      SELECT SUM(amount) as totalAmount
      FROM token_transfer
      WHERE method = 'AVTLifted' OR (method = 'TokenLifted' AND token_id = '0x0d88ed6e74bbfd96b831231638b66c05571e824f')
    `

    return await this.executeAggregateQuery(query, [], 'totalAmount')
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
