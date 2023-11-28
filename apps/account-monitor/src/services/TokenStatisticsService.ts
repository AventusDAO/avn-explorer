import { EntityManager } from "typeorm";
import { TokenTransfer } from "../model";

export class TokenTransferService {
  constructor(private readonly manager: EntityManager) { }

  async getTotalAmountByToken(tokenId: string): Promise<bigint> {
    const query = `
      SELECT SUM(amount) as totalAmount
      FROM token_transfer
      WHERE token_id = $1
    `;

    const result = await this.manager.query(query, [tokenId]);

    return result[0] ? BigInt(result[0].totalamount) : BigInt(0);
  }

  async getAverageAmountLast30Days(tokenId: string): Promise<bigint> {
    const currentDate = new Date();
    const thirtyDaysAgo = new Date(currentDate.setDate(currentDate.getDate() - 30));

    const query = `
      SELECT AVG(amount) as averageAmount
      FROM token_transfer
      WHERE token_id = $1
        AND timestamp >= $2
    `;

    const result = await this.manager.query(query, [tokenId, thirtyDaysAgo]);


    return result ? BigInt(result.averageAmount) : BigInt(0);
  }

  async getTotalAmountByAccountAndToken(accountId: string, tokenId: string): Promise<bigint> {
    const query = `
      SELECT SUM(amount) as totalAmount
      FROM token_transfer
      WHERE account_id = $1 AND token_id = $2
    `;

    const result = await this.manager.query(query, [accountId, tokenId]);

    return result[0] ? BigInt(result[0].totalamount) : BigInt(0);
  }

  async getAverageAmountLast7Days(accountId: string, tokenId: string): Promise<bigint> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const query = `
      SELECT AVG(amount) as averageAmount
      FROM token_transfer
      WHERE account_id = $1 AND token_id = $2
        AND timestamp >= $3
    `;

    const result = await this.manager.query(query, [accountId, tokenId, sevenDaysAgo]);

    return result[0] ? BigInt(result[0].averageamount) : BigInt(0);
  }
}

