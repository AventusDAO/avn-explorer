import { BatchContext, BatchProcessorItem, SubstrateBlock } from '@subsquid/substrate-processor'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import { getProcessor } from '@avn/config'
import { encodeId } from '@avn/utils'
import {
  SystemAccountStorage,
  WorkerNodePalletEarnedRewardsStorage,
  WorkerNodePalletRegistrarInventoryStorage,
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
    // for (const item of block.items) {
    //   if (item.kind === 'event') {
    //     // if (item.event.name.includes('WorkerNodePallet')) {
    //     // }
    //   }
    // }

    console.log('HELP 1 !!!', groups)

    await ctx.store.save(groups)
  }
}

processor.run(new TypeormDatabase(), main)

export async function getSolutionGroups(
  ctx: Ctx,
  block: SubstrateBlock
): Promise<SolutionGroupModel[]> {
  console.log('HELP 2 !!! inside getSolutionGroups')
  const registrarInventory = new WorkerNodePalletRegistrarInventoryStorage(ctx, block)
  const instance = new WorkerNodePalletSolutionsGroupsStorage(ctx, block)

  const groups: SolutionGroupModel[] = []
  console.log('HELP 3 !!! inside getSolutionGroups', registrarInventory.isV50)
  // console.log('HELP 2.5 !!! inside getSolutionGroups', instance.isV50)
  if (instance.isV50) {
    const solutionGroups = await instance.asV50.getAll()
    console.log('HELP 3 !!! inside getSolutionGroups', solutionGroups)
    for (const s of solutionGroups) {
      const solutionGroup = new SolutionGroupModel()
      solutionGroup.id = encodeId(s.namespace)
      solutionGroup.votingReward = s.rewardsConfig.votingRewardPerBlock
      solutionGroup.subscriptionReward = s.rewardsConfig.subscriptionRewardPerBlock
      solutionGroup.remainingBlocks = s.operationEndBlock - block.height
      solutionGroup.unclaimedRewards = await getUnclaimedRewardsForGroup(ctx, block, s)
      solutionGroup.reservedFunds = await getReservedFundsForSolutionGroup(ctx, block, s)
      groups.push(solutionGroup)
    }
    console.log('HELP 4 !!! inside getSolutionGroups', groups)
  }

  return groups
}

export async function getUnclaimedRewardsForGroup(
  ctx: Ctx,
  block: SubstrateBlock,
  group: SolutionGroup
): Promise<bigint> {
  console.log('HELP 5 !!! inside getUnclaimedRewardsForGroup')
  const rewardsStorage = new WorkerNodePalletEarnedRewardsStorage(ctx, block)
  let totalUnclaimed = BigInt(0)

  if (rewardsStorage.isV50) {
    const allRewards = await rewardsStorage.asV50.getPairs()
    console.log('HELP 6 !!! inside getUnclaimedRewardsForGroup', allRewards)
    for (const [key, rewards] of allRewards) {
      if (Buffer.from(key[1]).toString() === Buffer.from(group.namespace).toString()) {
        totalUnclaimed += rewards[0] + rewards[1] // sum of subscription and participation rewards
      }
    }
  }
  console.log('HELP 7 !!! inside getUnclaimedRewardsForGroup', totalUnclaimed)
  return totalUnclaimed
}

export async function getReservedFundsForSolutionGroup(
  ctx: Ctx,
  block: SubstrateBlock,
  group: SolutionGroup
): Promise<bigint> {
  const registrarInventoryStorage = new WorkerNodePalletRegistrarInventoryStorage(ctx, block)
  const accountStorage = new SystemAccountStorage(ctx, block)

  if (registrarInventoryStorage.isV50 && accountStorage.isV71) {
    const registrarInventory = await registrarInventoryStorage.asV50.getPairs()

    for (const [registrarId, _] of registrarInventory) {
      const account = await accountStorage.asV71.get(registrarId)
      if (account) {
        return account.data.reserved
      }
    }
  }

  return BigInt(0)
}