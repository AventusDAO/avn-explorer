import {
  BatchContext,
  BatchProcessorItem,
  SubstrateBlock,
  toHex
} from '@subsquid/substrate-processor'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import { getProcessor } from '@avn/config'
import { encodeId } from '@avn/utils'
import {
  SystemAccountStorage,
  WorkerNodePalletEarnedRewardsStorage,
  WorkerNodePalletRegistrarInventoryStorage,
  WorkerNodePalletSolutionGroupCalculatedRewardsStorage,
  WorkerNodePalletSolutionsGroupsStorage
} from './types/generated/parachain-testnet/storage'
import { BlockContext } from './types/generated/parachain-testnet/support'
import { SolutionGroup as SolutionGroupModel } from './model'
import { SolutionGroup } from './types/generated/parachain-testnet/v50'

const processor = getProcessor().addEvent('*', {
  data: {
    event: {
      args: true
    }
  }
})

export type Item = BatchProcessorItem<typeof processor>
export type Ctx = BatchContext<Store, Item>
export type BlockCtx = BlockContext

async function main(ctx: Ctx): Promise<void> {
  for (const block of ctx.blocks) {
    const groups = await getSolutionGroups(ctx, block.header)
    await ctx.store.save(groups)
  }
}

processor.run(new TypeormDatabase(), main)

export async function getSolutionGroups(
  ctx: Ctx,
  block: SubstrateBlock
): Promise<SolutionGroupModel[]> {
  const registrarInventory = new WorkerNodePalletRegistrarInventoryStorage(ctx, block)
  const instance = new WorkerNodePalletSolutionsGroupsStorage(ctx, block)

  const groups: SolutionGroupModel[] = []
  if (instance.isV73) {
    const solutionGroups = (await instance.asV73.getAll()).filter(
      s => s.operationEndBlock > block.height
    )
    for (const s of solutionGroups) {
      const totalReservedFundsForGroup =
        s.rewardsConfig.subscriptionRewardPerBlock *
          BigInt(s.operationEndBlock - s.operationStartBlock) +
        s.rewardsConfig.votingRewardPerBlock * BigInt(s.operationEndBlock - s.operationStartBlock)
      const solutionGroup = new SolutionGroupModel()
      solutionGroup.id = toHex(s.namespace)
      solutionGroup.votingReward = s.rewardsConfig.votingRewardPerBlock
      solutionGroup.subscriptionReward = s.rewardsConfig.subscriptionRewardPerBlock
      solutionGroup.remainingBlocks = s.operationEndBlock - block.height
      solutionGroup.unclaimedRewards = await getUnclaimedRewardsForGroup(ctx, block, s)
      solutionGroup.reservedFunds = totalReservedFundsForGroup
      groups.push(solutionGroup)
      console.log('SOLUTION GROUP !!!', solutionGroup)
    }
  }

  return groups
}

export async function getUnclaimedRewardsForGroup(
  ctx: Ctx,
  block: SubstrateBlock,
  group: SolutionGroup
): Promise<bigint> {
  const earnedRewardsStorage = new WorkerNodePalletEarnedRewardsStorage(ctx, block)

  let totalUnclaimed = BigInt(0)

  if (earnedRewardsStorage.isV50) {
    const allEarnedRewards = await earnedRewardsStorage.asV50.getPairs()
    for (const [key, rewards] of allEarnedRewards) {
      if (Buffer.from(key[1]).toString() === Buffer.from(group.namespace).toString()) {
        const unclaimedRewards = rewards[0] + rewards[1]
        totalUnclaimed += unclaimedRewards
      }
    }
  }
  return totalUnclaimed
}