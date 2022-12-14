import { getConfig, getProcessor } from '@avn/config'
import {
  BatchContext,
  // BatchProcessorCallItem,
  BatchProcessorEventItem,
  BatchProcessorItem,
  SubstrateBlock,
  BatchBlock
} from '@subsquid/substrate-processor'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import { stakingNominatorEventHandlers } from './handlers/stakingHandlers'
import { Nominator, NominatorUpdate } from './types/custom'
import { encodeId } from './utils'

type Item = BatchProcessorItem<typeof processor>
type EventItem = BatchProcessorEventItem<typeof processor>
// type CallItem = BatchProcessorCallItem<typeof processor>
type Context = BatchContext<Store, Item>

const config = getConfig()
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
// .addCall('*', {
//   data: { call: { origin: true } }
// } as const)
// .includeAllBlocks()

const processStaking = async (ctx: Context): Promise<void> => {
  // process all items in range
  const nominators = ctx.blocks.map(block => processBlock(ctx, block))

  if (nominators.length > 0) {
    const blocks = ctx.blocks.map(b => b.header.height)
    const uniqueNominators = [...new Set(nominators)]
    ctx.log
      .child('staking')
      .debug(
        `[${blocks[0]}-${blocks[blocks.length - 1]}]: nominators` + JSON.stringify(uniqueNominators)
      )
  }
}

async function getStake(nominatorUpdate: NominatorUpdate): Promise<bigint> {
  // TODO:
  return await Promise.resolve(0n)
}

function processBlock(ctx: Context, block: BatchBlock<Item>) {
  const updates = block.items.map(item => processItem(ctx, item, block.header))
  updates.map(el => getStake)
}

function processItem(ctx: Context, item: Item, header: SubstrateBlock): NominatorUpdate {
  if (item.kind === 'event') {
    item = item as EventItem
    if (item.name === '*') {
      throw new Error(`Missing event handler for event item: *, name: ${item.event.name}`)
    }
    const handler = stakingNominatorEventHandlers[item.name]
    if (!handler) throw new Error(`Missing handler for event: ${item.name}`)
    const nominator = handler(ctx, item.event)
    const update: NominatorUpdate = {
      nominator: encodeId(nominator, config.prefix),
      timestamp: header.timestamp,
      blockNumber: header.height
    }
    return update
  } else {
    const errMsg = `Unhandled items of kind: ${item.kind}, name: ${item.name}`
    ctx.log.child('staking').error(errMsg)
    throw new Error(errMsg)
  }
}

processor.run(new TypeormDatabase(), processStaking)
