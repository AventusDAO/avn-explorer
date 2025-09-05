import 'reflect-metadata'
import { Query, Resolver, Arg, ObjectType, Field, Int } from 'type-graphql'
import { Any, EntityManager } from 'typeorm'
import { InvalidInputError, TokenTransferService } from '../../services/TokenStatisticsService'
import {
  TransactionQueryService,
  TransactionCountResult
} from '../../services/TransactionQueryService'
import { TokenTransfer } from '../../model'

@ObjectType()
class TokenTransferCount {
  @Field()
  method!: string

  @Field()
  count!: number
}

@ObjectType()
class PayerTransaction {
  @Field(() => BigInt)
  balance!: bigint

  @Field(() => [TokenTransfer])
  transactions!: TokenTransfer[]

  @Field()
  transactionCount!: number
}

@ObjectType()
class TransactionCountData {
  @Field(() => Date)
  blockTimestamp!: Date

  @Field(() => String)
  blockNumber!: string

  @Field(() => Int)
  totalNumTransactions!: number
}

@ObjectType()
class TransactionCountSummary {
  @Field(() => Int)
  totalCount!: number

  @Field(() => String, { nullable: true })
  startBlock?: string

  @Field(() => String, { nullable: true })
  endBlock?: string

  @Field(() => [TransactionCountData])
  blockData!: TransactionCountData[]
}

@Resolver()
export class TokenStatisticsResolver {
  private readonly tokenStatisticsService: TokenTransferService | null = null

  constructor(private readonly tx: () => Promise<EntityManager>) {}

  @Query(() => BigInt)
  async getAverageAmountLast30Days(@Arg('tokenId') tokenId: string): Promise<bigint> {
    const manager = await this.tx()
    const tokenStatisticsService = new TokenTransferService(manager)
    return await tokenStatisticsService.getAverageAmountLastNDays(30, tokenId)
  }

  @Query(() => BigInt)
  async getAverageAmountLast7Days(
    @Arg('accountId') accountId: string,
    @Arg('tokenId') tokenId: string
  ): Promise<bigint> {
    const manager = await this.tx()
    const tokenStatisticsService = new TokenTransferService(manager)
    return await tokenStatisticsService.getAverageAmountLastNDays(7, tokenId, accountId)
  }

  @Query(() => BigInt)
  async getTotalAmountByToken(@Arg('tokenId') tokenId: string): Promise<bigint> {
    const manager = await this.tx()
    const tokenStatisticsService = new TokenTransferService(manager)
    return await tokenStatisticsService.getTotalAmountByToken(tokenId)
  }

  @Query(() => BigInt)
  async getTotalLoweredAmountByToken(@Arg('tokenId') tokenId: string): Promise<bigint> {
    const manager = await this.tx()
    const tokenStatisticsService = new TokenTransferService(manager)
    return await tokenStatisticsService.getTotalLoweredAmountByToken(tokenId)
  }

  @Query(() => BigInt)
  async getTotalLiftedAmountByToken(@Arg('tokenId') tokenId: string): Promise<bigint> {
    const manager = await this.tx()
    const tokenStatisticsService = new TokenTransferService(manager)
    return await tokenStatisticsService.getTotalLiftedAmountByToken(tokenId)
  }

  @Query(() => BigInt)
  async getTotalAvtLiftedAmount(): Promise<bigint> {
    const manager = await this.tx()
    const tokenStatisticsService = new TokenTransferService(manager)
    return await tokenStatisticsService.getTotalAvtLiftedAmount()
  }

  @Query(() => BigInt)
  async getTotalAvtLoweredAmount(): Promise<bigint> {
    const manager = await this.tx()
    const tokenStatisticsService = new TokenTransferService(manager)
    return await tokenStatisticsService.getTotalAvtLoweredAmount()
  }

  @Query(() => BigInt)
  async getTotalAmountByAccountAndToken(
    @Arg('accountId') accountId: string,
    @Arg('tokenId') tokenId: string
  ): Promise<bigint> {
    const manager = await this.tx()
    const tokenStatisticsService = new TokenTransferService(manager)
    return await tokenStatisticsService.getTotalAmountByAccountAndToken(accountId, tokenId)
  }

  @Query(() => [TokenTransferCount])
  async countTokenTransfersByMethodForMonth(
    @Arg('tokenId') tokenId: string,
    @Arg('startDate', () => String) startDate: string,
    @Arg('endDate', () => String) endDate: string
  ): Promise<TokenTransferCount[]> {
    const manager = await this.tx()
    const tokenStatisticsService = new TokenTransferService(manager)
    return await tokenStatisticsService.countTokenTransactionsByMethodForPeriod(
      tokenId,
      startDate,
      endDate
    )
  }

  @Query(() => PayerTransaction)
  async getPayerTransactionsAndBalance(
    @Arg('payerId') payerId: string,
    @Arg('startDate', () => String) startDate: string,
    @Arg('endDate', () => String) endDate: string
  ): Promise<PayerTransaction | null> {
    try {
      const manager = await this.tx()
      const tokenStatisticsService = new TokenTransferService(manager)

      const parsedStartDate = parse(startDate)
      const parsedEndDate = parse(endDate)

      if (!parsedStartDate || !parsedEndDate) {
        console.error('Invalid date format.')
        return { balance: BigInt(0), transactions: [], transactionCount: 0 }
      }

      return await tokenStatisticsService.getPayerTransactionsAndBalance(
        payerId,
        parsedStartDate,
        parsedEndDate
      )
    } catch (error) {
      console.error('Error getting payer transactions and balance:', error)
      return { balance: BigInt(0), transactions: [], transactionCount: 0 }
    }
  }

  @Query(() => Int, {
    description: 'Get total number of signed transactions across all blocks'
  })
  async getTotalSignedTransactions(): Promise<number> {
    const manager = await this.tx()
    const service = new TransactionQueryService(manager)

    try {
      return await service.getTotalSignedTransactions()
    } catch (error) {
      console.error('Error getting total signed transactions:', error)
      throw new Error('Failed to retrieve transaction count data')
    }
  }

  @Query(() => Int, {
    description: 'Get total number of signed transactions within a block range'
  })
  async getTotalSignedTransactionsInRange(
    @Arg('startBlock', { description: 'Start block number (inclusive)' }) startBlock: string,
    @Arg('endBlock', { description: 'End block number (inclusive)' }) endBlock: string
  ): Promise<number> {
    const manager = await this.tx()
    const service = new TransactionQueryService(manager)

    try {
      const start = BigInt(startBlock)
      const end = BigInt(endBlock)

      if (start > end) {
        throw new Error('startBlock cannot be greater than endBlock')
      }

      return await service.getTotalSignedTransactionsInRange(start, end)
    } catch (error) {
      console.error('Error getting total signed transactions in range:', error)
      throw new Error('Failed to retrieve transaction count data')
    }
  }

  @Query(() => TransactionCountSummary, {
    description: 'Get detailed transaction count data with block information'
  })
  async getTransactionCountSummary(
    @Arg('startBlock', { nullable: true, description: 'Start block number (inclusive)' })
    startBlock?: string,
    @Arg('endBlock', { nullable: true, description: 'End block number (inclusive)' })
    endBlock?: string,
    @Arg('limit', () => Int, {
      nullable: true,
      defaultValue: 100,
      description: 'Maximum number of blocks to return'
    })
    limit: number = 100
  ): Promise<TransactionCountSummary> {
    const manager = await this.tx()
    const service = new TransactionQueryService(manager)

    try {
      let blockData: TransactionCountResult[] = []
      let totalCount = 0

      if (limit > 1000) {
        throw new Error('Limit cannot exceed 1000 blocks')
      }

      if ((startBlock && !endBlock) ?? (!startBlock && endBlock)) {
        throw new Error('Both startBlock and endBlock must be provided when specifying a range')
      }

      if (startBlock && endBlock) {
        const start = BigInt(startBlock)
        const end = BigInt(endBlock)

        if (start > end) {
          throw new Error('startBlock cannot be greater than endBlock')
        }

        blockData = await service.getTransactionCountsByBlockRange(start, end)
        totalCount = await service.getTotalSignedTransactionsInRange(start, end)
      } else {
        blockData = await service.getLatestBlockTransactionData(limit)
        totalCount = await service.getTotalSignedTransactions()
      }

      return {
        totalCount,
        startBlock,
        endBlock,
        blockData: blockData.map(item => ({
          blockTimestamp: item.blockTimestamp,
          blockNumber: item.blockNumber.toString(),
          totalNumTransactions: item.totalNumTransactions
        }))
      }
    } catch (error) {
      console.error('Error getting transaction count summary:', error)
      throw new Error('Failed to retrieve transaction count summary')
    }
  }

  @Query(() => [TransactionCountData], {
    description: 'Get transaction count data for specific blocks'
  })
  async getTransactionCountByBlocks(
    @Arg('blockNumbers', () => [String], {
      description: 'Array of specific block numbers to query'
    })
    blockNumbers: string[]
  ): Promise<TransactionCountData[]> {
    const manager = await this.tx()

    try {
      if (blockNumbers.length === 0) {
        return []
      }

      if (blockNumbers.length > 100) {
        throw new Error('Cannot query more than 100 blocks at once')
      }

      const decimal = /^(0|[1-9]\d*)$/
      const { placeholders, params } = blockNumbers.reduce(
        (acc, raw, i) => {
          const bn = raw.trim()
          if (!decimal.test(bn)) throw new Error(`Invalid block number: ${raw}`)
          const normalized = BigInt(bn).toString()
          acc.params.push(normalized)
          acc.placeholders.push(`$${i + 1}`)
          return acc
        },
        { placeholders: [] as string[], params: [] as string[] }
      )

      const query = `
        SELECT 
          block_timestamp as "blockTimestamp",
          block_number as "blockNumber",
          total_signed_transactions as "totalNumTransactions"
        FROM block_transaction_count
        WHERE block_number IN (${placeholders.join(',')})
        ORDER BY block_number ASC
      `

      const result = await manager.query(query, params)

      return result.map((row: any) => ({
        blockTimestamp: new Date(row.blockTimestamp),
        blockNumber: row.blockNumber,
        totalNumTransactions: parseInt(row.totalNumTransactions, 10)
      }))
    } catch (error) {
      console.error('Error getting transaction count by blocks:', error)
      throw new Error('Failed to retrieve transaction count data for specified blocks')
    }
  }
}

export function parseISO8601(dateString: string): Date | null {
  if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(dateString)) {
    const date = new Date(dateString)
    return isNaN(date.getTime()) ? null : date
  }
  return null
}

export function parseDDMMYYYY(dateString: string, separator: string): Date | null {
  const parts = dateString.split(separator)
  if (parts.length !== 3) return null

  const [day, month, year] = parts.map(part => parseInt(part, 10))
  if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
    const date = new Date(year, month - 1, day)
    return isNaN(date.getTime()) ? null : date
  }
  return null
}

export function parse(dateString: string): Date | null {
  return (
    parseISO8601(dateString) ?? parseDDMMYYYY(dateString, '/') ?? parseDDMMYYYY(dateString, '.')
  )
}
