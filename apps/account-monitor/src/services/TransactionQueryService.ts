import { EntityManager } from 'typeorm'
import { BlockTransactionCount } from '../model'

export interface TransactionCountResult {
  blockTimestamp: Date
  blockNumber: bigint
  totalNumTransactions: number
}

export class TransactionQueryService {
  constructor(private readonly manager: EntityManager) {}

  private async executeAggregateQuery(query: string, params: any[]): Promise<any[]> {
    try {
      const result = await this.manager.query(query, params)
      return result || []
    } catch (error) {
      throw new Error('Error executing database operation')
    }
  }

  async getTotalSignedTransactions(): Promise<number> {
    const query = `
      SELECT COALESCE(SUM(total_signed_transactions), 0) as totalCount
      FROM block_transaction_count
    `
    const result = await this.executeAggregateQuery(query, [])
    const totalCount = parseInt(result[0]?.totalcount || '0', 10)

    return totalCount
  }

  async getTransactionCountsByBlockRange(
    startBlock: bigint,
    endBlock: bigint
  ): Promise<TransactionCountResult[]> {
    const query = `
      SELECT 
        block_timestamp as "blockTimestamp",
        block_number as "blockNumber",
        total_signed_transactions as "totalNumTransactions"
      FROM block_transaction_count
      WHERE block_number >= $1 AND block_number <= $2
      ORDER BY block_number ASC
    `

    const result = await this.executeAggregateQuery(query, [
      startBlock.toString(),
      endBlock.toString()
    ])
    return result.map(row => ({
      blockTimestamp: new Date(row.blockTimestamp),
      blockNumber: BigInt(row.blockNumber),
      totalNumTransactions: parseInt(row.totalNumTransactions, 10)
    }))
  }

  async getTotalSignedTransactionsInRange(startBlock: bigint, endBlock: bigint): Promise<number> {
    const query = `
      SELECT COALESCE(SUM(total_signed_transactions), 0) as totalCount
      FROM block_transaction_count
      WHERE block_number >= $1 AND block_number <= $2
    `

    const result = await this.executeAggregateQuery(query, [
      startBlock.toString(),
      endBlock.toString()
    ])
    const totalCount = parseInt(result[0]?.totalcount || '0', 10)

    return totalCount
  }

  async getLatestBlockTransactionData(limit: number = 10): Promise<TransactionCountResult[]> {
    const query = `
      SELECT 
        block_timestamp as "blockTimestamp",
        block_number as "blockNumber",
        total_signed_transactions as "totalNumTransactions"
      FROM block_transaction_count
      ORDER BY block_number DESC
      LIMIT $1
    `

    const result = await this.executeAggregateQuery(query, [limit])
    return result.map(row => ({
      blockTimestamp: new Date(row.blockTimestamp),
      blockNumber: BigInt(row.blockNumber),
      totalNumTransactions: parseInt(row.totalNumTransactions, 10)
    }))
  }

  async hasTransactionCountForBlock(blockNumber: bigint): Promise<boolean> {
    const existing = await this.manager.findOne(BlockTransactionCount, {
      where: { id: blockNumber.toString() }
    })
    return !!existing
  }

  async saveBlockTransactionCount(
    blockNumber: bigint,
    blockTimestamp: Date,
    signedTransactionCount: number
  ): Promise<void> {
    const record = new BlockTransactionCount({
      id: blockNumber.toString(),
      blockNumber,
      blockTimestamp,
      totalSignedTransactions: signedTransactionCount
    })

    await this.manager.save(record)
  }
}

export class TransactionQueryError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'TransactionQueryError'
  }
}
