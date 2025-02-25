import { EntityManager } from 'typeorm'
import { DatabaseError, NotFoundError } from '../errors'
import { Node as NetworkNode, Reward, Account } from '../model'

export class NodeStatisticsService {
  constructor(private readonly manager: EntityManager) {}

  private async verifyAccount(accountId: string): Promise<void> {
    const account = await this.manager.findOne(Account, {
      where: { id: accountId }
    })
    if (!account) {
      throw new NotFoundError(`Account with ID ${accountId} not found`)
    }
  }

  private async verifyNode(nodeId: string): Promise<void> {
    const node = await this.manager.findOne(NetworkNode, {
      where: { id: nodeId }
    })
    if (!node) {
      throw new NotFoundError(`Node with ID ${nodeId} not found`)
    }
  }

  async getAccountRewardsLast24Hours(accountId: string): Promise<bigint> {
    try {
      await this.verifyAccount(accountId)

      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

      const result = await this.manager
        .createQueryBuilder(Reward, 'reward')
        .select('COALESCE(SUM(reward.amount), 0)', 'totalAmount')
        .where('reward.owner_id = :accountId', { accountId })
        .andWhere('reward.blockTimestamp >= :startTime', {
          startTime: twentyFourHoursAgo
        })
        .getRawOne()

      return BigInt(result?.totalAmount ?? 0)
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      throw new DatabaseError(
        `Failed to get last 24h rewards for account ${accountId}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      )
    }
  }

  async getAccountRewardsInTimeRange(
    accountId: string,
    startTime: Date,
    endTime: Date
  ): Promise<bigint> {
    try {
      await this.verifyAccount(accountId)

      const result = await this.manager
        .createQueryBuilder(Reward, 'reward')
        .select('COALESCE(SUM(reward.amount), 0)', 'totalAmount')
        .where('reward.owner_id = :accountId', { accountId })
        .andWhere('reward.blockTimestamp BETWEEN :startTime AND :endTime', {
          startTime,
          endTime
        })
        .getRawOne()

      return BigInt(result?.totalAmount ?? 0)
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      throw new DatabaseError(
        `Failed to get rewards in time range for account ${accountId}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      )
    }
  }

  async getAccountLifetimeRewards(accountId: string): Promise<bigint> {
    try {
      await this.verifyAccount(accountId)

      const result = await this.manager
        .createQueryBuilder(Reward, 'reward')
        .select('COALESCE(SUM(reward.amount), 0)', 'totalAmount')
        .where('reward.owner_id = :accountId', { accountId })
        .getRawOne()

      return BigInt(result?.totalAmount ?? 0)
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      throw new DatabaseError(
        `Failed to get lifetime rewards for account ${accountId}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      )
    }
  }

  async getNodeTotalRewards(nodeId: string): Promise<bigint> {
    try {
      await this.verifyNode(nodeId)

      const result = await this.manager
        .createQueryBuilder(Reward, 'reward')
        .select('COALESCE(SUM(reward.amount), 0)', 'totalAmount')
        .where('reward.node_id = :nodeId', { nodeId })
        .getRawOne()

      return BigInt(result?.totalAmount ?? 0)
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      throw new DatabaseError(
        `Failed to get rewards for node ${nodeId}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      )
    }
  }

  async getAccountNodesCount(accountId: string): Promise<number> {
    try {
      await this.verifyAccount(accountId)

      const count = await this.manager
        .createQueryBuilder(NetworkNode, 'node')
        .where('node.owner_id = :accountId', { accountId })
        .getCount()

      return count
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      throw new DatabaseError(
        `Failed to get node count for account ${accountId}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      )
    }
  }

  async getRewardCountInTimeRange(
    accountId: string,
    startTime: Date,
    endTime: Date
  ): Promise<number> {
    try {
      await this.verifyAccount(accountId)

      return await this.manager
        .createQueryBuilder(Reward, 'reward')
        .where('reward.owner_id = :accountId', { accountId })
        .andWhere('reward.blockTimestamp BETWEEN :startTime AND :endTime', {
          startTime,
          endTime
        })
        .getCount()
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      throw new DatabaseError(
        `Failed to get reward count for account ${accountId}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      )
    }
  }

  async getAverageRewardInTimeRange(
    accountId: string,
    startTime: Date,
    endTime: Date
  ): Promise<bigint> {
    try {
      await this.verifyAccount(accountId)

      const result = await this.manager
        .createQueryBuilder(Reward, 'reward')
        .select('COALESCE(AVG(reward.amount::numeric), 0)', 'avgAmount')
        .where('reward.owner_id = :accountId', { accountId })
        .andWhere('reward.blockTimestamp BETWEEN :startTime AND :endTime', {
          startTime,
          endTime
        })
        .getRawOne()

      return BigInt(Math.floor(Number(result?.avgAmount ?? 0)))
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      throw new DatabaseError(
        `Failed to get average reward for account ${accountId}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      )
    }
  }
}
