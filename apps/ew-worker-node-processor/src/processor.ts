import { BatchContext, BatchProcessorItem, SubstrateBlock } from '@subsquid/substrate-processor'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import { getProcessor } from '@avn/config'
import { encodeId } from '@avn/utils'
import { WorkerNodePalletSolutionsGroupsStorage } from './types/generated/parachain-testnet/storage'
import { Block, BlockContext } from './types/generated/parachain-testnet/support'
import { SolutionGroup as SolutionGroupModel } from './model'

const processor = getProcessor().addEvent('TokenManager.TokenTransferred', {
  data: {
    // provide the fields needed - event, call
    event: {
      args: true,
      extrinsic: {
        signature: true,
        hash: true
      },
      call: { origin: true, args: true }
    }
  }
} as const)

export type Item = BatchProcessorItem<typeof processor>
export type Ctx = BatchContext<Store, Item>
export type BlockCtx = BlockContext

async function main(ctx: Ctx): Promise<void> {
  for (const block of ctx.blocks) {
    const groups = await getSolutionGroups(ctx, block.header)
    for (const item of block.items) {
      if (item.kind === 'event') {
        // if (item.event.name.includes('WorkerNodePallet')) {
        // }
        // ... processing events
      }

      //   store each item
      //   with ctx.store.save(...)
    }

    await ctx.store.save(groups)
  }

  //   with ctx.store.save(...)
}

processor.run(new TypeormDatabase(), main)

export async function getSolutionGroups(
  ctx: Ctx,
  block: SubstrateBlock
): Promise<SolutionGroupModel[]> {
  const instance = new WorkerNodePalletSolutionsGroupsStorage(ctx, block)
  const groups: SolutionGroupModel[] = []

  if (instance.isV50) {
    const solutionGroups = await instance.asV50.getAll()

    for (const s of solutionGroups) {
      const solutionGroup = new SolutionGroupModel()
      solutionGroup.id = encodeId(s.info.name)
      solutionGroup.votingReward = s.rewardsConfig.votingRewardPerBlock
      solutionGroup.subscriptionReward = s.rewardsConfig.subscriptionRewardPerBlock
      solutionGroup.remainingBlocks = s.operationEndBlock - block.height
      groups.push(solutionGroup)
    }
  }

  return groups
}
