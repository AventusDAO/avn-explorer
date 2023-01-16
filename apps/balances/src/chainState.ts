import { BatchContext, SubstrateBlock } from '@subsquid/substrate-processor'
import { Store } from '@subsquid/typeorm-store'
import { getTotalIssuance } from './eventHandlers'
import { Account, ChainState } from './model'

export async function getChainState(
  ctx: BatchContext<Store, unknown>,
  block: SubstrateBlock
): Promise<ChainState> {
  const state = new ChainState({ id: block.id })

  state.timestamp = new Date(block.timestamp)
  state.blockNumber = block.height
  const totalIssuance = await getTotalIssuance(ctx, block)
  if (!(totalIssuance instanceof Error)) state.tokenBalance = totalIssuance ?? 0n

  state.tokenHolders = await ctx.store.count(Account)

  return state
}

export async function saveRegularChainState(
  ctx: BatchContext<Store, unknown>,
  block: SubstrateBlock
): Promise<void> {
  const state = await getChainState(ctx, block)
  await ctx.store.insert(state)

  ctx.log.child('state').info(`updated at block ${block.height}`)
}

export async function saveCurrentChainState(
  ctx: BatchContext<Store, unknown>,
  block: SubstrateBlock
): Promise<void> {
  const state = await getChainState(ctx, block)
  await ctx.store.save(new ChainState({ ...state, id: '0' }))
}

export async function getLastChainState(store: Store): Promise<ChainState | undefined> {
  return await store.get(ChainState, {
    where: {},
    order: {
      timestamp: 'DESC'
    }
  })
}
