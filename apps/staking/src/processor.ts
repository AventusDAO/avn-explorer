import { getProcessor } from '@avn/config'
import {
  BatchContext,
  // BatchProcessorCallItem,
  BatchProcessorEventItem,
  BatchProcessorItem
} from '@subsquid/substrate-processor'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import { stakingNominatorEventHandlers } from './handlers/stakingHandlers'

type Item = BatchProcessorItem<typeof processor>
type EventItem = BatchProcessorEventItem<typeof processor>
// type CallItem = BatchProcessorCallItem<typeof processor>
type Context = BatchContext<Store, Item>

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
  const itemNames = ctx.blocks
    .map(b => b.items)
    .flat()
    .map(i => i.name)
  // .filter(i => parachainStakingEventNames.includes(i))

  if (itemNames.length > 0) {
    const blocks = ctx.blocks.map(b => b.header.height)
    ctx.log
      .child('staking')
      .debug(
        `[${blocks[0]}-${blocks[blocks.length - 1]}]: staking items` + JSON.stringify(itemNames)
      )
  }

  // process all items in range
  ctx.blocks
    .map(b => b.items)
    .flat()
    .map(item => processItem(ctx, item))
}

function processItem(ctx: Context, item: Item): void {
  console.log('processing item ' + item.name)
  if (item.kind === 'event') {
    item = item as EventItem
    if (item.name === '*') {
      throw new Error(`Missing event handler for event item: *, name: ${item.event.name}`)
    }
    const handler = stakingNominatorEventHandlers[item.name]
    if (!handler) throw new Error(`Missing handler for event: ${item.name}`)
    const nominator = handler(ctx, item.event)
    ctx.log
      .child('staking')
      .debug(
        `Revalidate Nominator ${nominator.toString()} at ${
          ctx.blocks[ctx.blocks.length - 1].header.height
        }`
      )
  } else {
    ctx.log.child('staking').error(`Unhandled items of kind: ${item.kind}, name: ${item.name}`)
  }
}

processor.run(new TypeormDatabase(), processStaking)
