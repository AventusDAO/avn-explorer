import 'reflect-metadata'
import { Query, Resolver, Arg, ObjectType, Field } from 'type-graphql'
import { Any, EntityManager } from 'typeorm'
import { TokenTransferService } from '../../services/TokenStatisticsService'
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

@Resolver()
export class TokenStatisticsResolver {
  private readonly tokenStatisticsService: TokenTransferService | null = null

  constructor(private readonly tx: () => Promise<EntityManager>) { }

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
  ): Promise<PayerTransaction> {
    const manager = await this.tx()
    const tokenStatisticsService = new TokenTransferService(manager)
    return await tokenStatisticsService.getPayerTransactionsAndBalance(payerId, new Date(startDate), new Date(endDate))
  }
}
