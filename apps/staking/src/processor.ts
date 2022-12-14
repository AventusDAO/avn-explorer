import { getProcessor } from '@avn/config'
import {
  BatchContext,
  BatchProcessorEventItem,
  BatchProcessorItem,
  toHex
} from '@subsquid/substrate-processor'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import { getLastChainState, setChainState } from './services/chainState'
import { stakingNominatorEventHandlers } from './handlers/stakingHandlers'
import { AddressHex, Nominator } from './types/custom'
import { getNominations, saveAccounts } from './services/accounts'

type Item = BatchProcessorItem<typeof processor>
type EventItem = BatchProcessorEventItem<typeof processor>
export type Context = BatchContext<Store, Item>

const SAVE_PERIOD = 12 * 60 * 60 * 1000
let lastStateTimestamp: number | undefined

const processor = getProcessor()
  .addEvent('ParachainStaking.NominationIncreased', {
    data: { event: { args: true } }
  } as const)
  .addEvent('ParachainStaking.NominationDecreased', {
    data: { event: { args: true } }
  } as const)
  .addEvent('ParachainStaking.NominatorLeft', {
    data: { event: { args: true } }
  } as const)
  .addEvent('ParachainStaking.NominationRevoked', {
    data: { event: { args: true } }
  } as const)
  .addEvent('ParachainStaking.NominationKicked', {
    data: { event: { args: true } }
  } as const)
  .addEvent('ParachainStaking.Nomination', {
    data: { event: { args: true } }
  } as const)
  .addEvent('ParachainStaking.NominatorLeftCandidate', {
    data: { event: { args: true } }
  } as const)

const processStaking = async (ctx: Context): Promise<void> => {
  const pendingAccounts = new Set<AddressHex>()
  for (const block of ctx.blocks) {
    block.items
      .map(item => processItem(ctx, item))
      .map(n => toHex(n))
      .forEach(pendingAccounts.add, pendingAccounts)

    if (lastStateTimestamp == null) {
      lastStateTimestamp = (await getLastChainState(ctx.store))?.timestamp.getTime() ?? 0
    }

    if (block.header.timestamp - lastStateTimestamp >= SAVE_PERIOD) {
      const nominations = await getNominations(ctx, block.header, [...pendingAccounts])
      await saveAccounts(ctx, block.header, nominations)
      await setChainState(ctx, block.header)

      lastStateTimestamp = block.header.timestamp
      pendingAccounts.clear()
    }
  }

  const block = ctx.blocks[ctx.blocks.length - 1]
  const nominations = await getNominations(ctx, block.header, [...pendingAccounts])
  await saveAccounts(ctx, block.header, nominations)
  await setChainState(ctx, block.header)
}

function processItem(ctx: Context, item: Item): Nominator {
  if (item.kind === 'event') {
    item = item as EventItem
    if (item.name === '*') {
      throw new Error(`Missing event handler for event item: *, name: ${item.event.name}`)
    }
    const handler = stakingNominatorEventHandlers[item.name]
    if (!handler) throw new Error(`Missing handler for event: ${item.name}`)
    return handler(ctx, item.event)
  } else {
    const errMsg = `Unhandled items of kind: ${item.kind}, name: ${item.name}`
    ctx.log.child('staking').error(errMsg)
    throw new Error(errMsg)
  }
}

processor.run(new TypeormDatabase(), processStaking)
