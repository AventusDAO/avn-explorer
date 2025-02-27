import 'reflect-metadata'
import { Query, Resolver, Arg } from 'type-graphql'
import { EntityManager } from 'typeorm'
import { NodeStatisticsService } from '../../services/NodeStatisticsService'
import { validateAndParse, validateDateRange } from '../../utils/dateValidation'

@Resolver()
export class NodeStatisticsResolver {
  constructor(private readonly tx: () => Promise<EntityManager>) {}

  @Query(() => BigInt)
  async getAccountRewardsLast24Hours(@Arg('accountId') accountId: string): Promise<bigint> {
    const manager = await this.tx()
    const nodeStatisticsService = new NodeStatisticsService(manager)
    return await nodeStatisticsService.getAccountRewardsLast24Hours(accountId)
  }

  @Query(() => BigInt)
  async getAccountRewardsInTimeRange(
    @Arg('accountId') accountId: string,
    @Arg('startTime') startTime: string,
    @Arg('endTime') endTime: string
  ): Promise<bigint> {
    const fromDate = validateAndParse(startTime, 'fromDate')
    const toDate = validateAndParse(endTime, 'toDate')

    validateDateRange(fromDate, toDate, 'fromDate', 'toDate')

    const manager = await this.tx()
    const nodeStatisticsService = new NodeStatisticsService(manager)
    return await nodeStatisticsService.getAccountRewardsInTimeRange(accountId, fromDate, toDate)
  }

  @Query(() => BigInt)
  async getAccountLifetimeRewards(@Arg('accountId') accountId: string): Promise<bigint> {
    const manager = await this.tx()
    const nodeStatisticsService = new NodeStatisticsService(manager)
    return await nodeStatisticsService.getAccountLifetimeRewards(accountId)
  }

  @Query(() => BigInt)
  async getNodeTotalRewards(@Arg('nodeId') nodeId: string): Promise<bigint> {
    const manager = await this.tx()
    const nodeStatisticsService = new NodeStatisticsService(manager)
    return await nodeStatisticsService.getNodeTotalRewards(nodeId)
  }

  @Query(() => Number)
  async getAccountNodesCount(@Arg('accountId') accountId: string): Promise<number> {
    const manager = await this.tx()
    const nodeStatisticsService = new NodeStatisticsService(manager)
    return await nodeStatisticsService.getAccountNodesCount(accountId)
  }

  @Query(() => Number)
  async getRewardCountInTimeRange(
    @Arg('accountId') accountId: string,
    @Arg('startTime') startTime: string,
    @Arg('endTime') endTime: string
  ): Promise<number> {
    const fromDate = validateAndParse(startTime, 'fromDate')
    const toDate = validateAndParse(endTime, 'toDate')

    validateDateRange(fromDate, toDate, 'fromDate', 'toDate')

    const manager = await this.tx()
    const nodeStatisticsService = new NodeStatisticsService(manager)
    return await nodeStatisticsService.getRewardCountInTimeRange(accountId, fromDate, toDate)
  }

  @Query(() => BigInt)
  async getAverageRewardInTimeRange(
    @Arg('accountId') accountId: string,
    @Arg('startTime') startTime: string,
    @Arg('endTime') endTime: string
  ): Promise<bigint> {
    const fromDate = validateAndParse(startTime, 'fromDate')
    const toDate = validateAndParse(endTime, 'toDate')

    validateDateRange(fromDate, toDate, 'fromDate', 'toDate')

    const manager = await this.tx()
    const nodeStatisticsService = new NodeStatisticsService(manager)
    return await nodeStatisticsService.getAverageRewardInTimeRange(accountId, fromDate, toDate)
  }
}
