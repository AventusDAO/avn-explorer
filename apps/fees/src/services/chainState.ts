import { BatchContext, SubstrateBlock } from '@subsquid/substrate-processor'
import { Store } from '@subsquid/typeorm-store'
import { ChainState } from '../model'

export async function getChainState(
  ctx: BatchContext<Store, unknown>,
  block: SubstrateBlock
): Promise<ChainState> {
  const state = new ChainState({ id: block.id })

  state.timestamp = new Date(block.timestamp)
  state.blockNumber = block.height

  return state
}

export async function setChainState(
  ctx: BatchContext<Store, unknown>,
  block: SubstrateBlock
): Promise<void> {
  const state = await getChainState(ctx, block)
  await ctx.store.insert(state)

  ctx.log.child('state').info(`updated at block ${block.height}`)
}

export async function getLastChainState(store: Store): Promise<ChainState | undefined> {
  return store.get(ChainState, {
    where: {},
    order: {
      timestamp: 'DESC'
    }
  })
}
