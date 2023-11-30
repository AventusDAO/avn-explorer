import { EntityManager } from "typeorm";

export class TokenTransferService {
  constructor(private readonly manager: EntityManager) { }

  private formatDateForQuery(date: Date): string {
    return date.toISOString();
  }

  private async executeAggregateQuery(query: string, params: any[], output: string): Promise<bigint> {
    try {
      const result = await this.manager.query(query, params);
      console.log(result)
      return result[0] ? (result[0][output] ? BigInt(result[0][output]) : BigInt(0)) : BigInt(0);
    } catch (error) {
      console.error('Error executing aggregate query:', error);
      throw new Error('Error executing database operation');
    }
  }

  async getTotalAmountByToken(tokenId: string): Promise<bigint> {
    const query = `
      SELECT SUM(amount) as totalAmount
      FROM token_transfer
      WHERE token_id = $1
    `;

    return await this.executeAggregateQuery(query, [tokenId], 'totalamount');
  }

  async getTotalAmountByAccountAndToken(accountId: string, tokenId: string): Promise<bigint> {
    const query = `
      SELECT SUM(amount) as totalAmount
      FROM token_transfer
      WHERE to_id = $1 AND token_id = $2
    `;

    return await this.executeAggregateQuery(query, [accountId, tokenId], 'totalamount');
  }

  async getAverageAmountLast30Days(tokenId: string): Promise<bigint> {
    const thirtyDaysAgo = this.formatDateForQuery(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));

    const query = `
      SELECT AVG(amount) as averageAmount
      FROM token_transfer
      WHERE token_id = $1
        AND timestamp >= $2
    `;

    return await this.executeAggregateQuery(query, [tokenId, thirtyDaysAgo], 'averageamount');
  }

  async getAverageAmountLast7Days(accountId: string, tokenId: string): Promise<bigint> {
    const sevenDaysAgo = this.formatDateForQuery(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));


    const query = `
      SELECT AVG(amount) as averageAmount
      FROM token_transfer
      WHERE to_id = $1 AND token_id = $2
        AND timestamp >= $3
    `;

    return await this.executeAggregateQuery(query, [accountId, tokenId, sevenDaysAgo], 'averageamount');
  }

  async getTotalLoweredAmountByToken(tokenId: string): Promise<bigint> {
    const query = `
      SELECT SUM(amount) as totalAmount
      FROM token_transfer
      WHERE token_id = $1 AND method = 'TokenLowered'
    `;

    return await this.executeAggregateQuery(query, [tokenId], 'totalamount');
  }

  async getTotalLoweredAmountByAccountAndToken(accountId: string, tokenId: string): Promise<bigint> {
    const query = `
      SELECT SUM(amount) as totalAmount
      FROM token_transfer
      WHERE token_id = $1 AND method = 'TokenLowered' AND 
    `;

    return await this.executeAggregateQuery(query, [tokenId], 'totalamount');
  }

  async getTotalLiftedAmountByToken(tokenId: string): Promise<bigint> {
    const query = `
      SELECT SUM(amount) as totalAmount
      FROM token_transfer
      WHERE token_id = $1 AND method = 'TokenLifted'
    `;

    return await this.executeAggregateQuery(query, [tokenId], 'totalamount');
  }

  async countTokenTransfersByMethodForMonth(tokenId: string, startDate: string, endDate: string): Promise<any[]> {
    const query = `
      SELECT method, COUNT(*) as count
      FROM token_transfer
      WHERE timestamp >= $1
        AND timestamp < $2
        AND token_id = $3
      GROUP BY method
    `;

    const result = await this.manager.query(query, [startDate, endDate, tokenId]);
    return result;
  }
}

