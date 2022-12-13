import { getProcessor } from '@avn/config'
import {
  BatchContext,
  BatchProcessorCallItem,
  BatchProcessorEventItem,
  BatchProcessorItem,
  SubstrateBlock
} from '@subsquid/substrate-processor'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import { parachainStakingEventNames } from './events'

type Item = BatchProcessorItem<typeof processor>
type EventItem = BatchProcessorEventItem<typeof processor>
type CallItem = BatchProcessorCallItem<typeof processor>
type Context = BatchContext<Store, Item>

const processor = getProcessor({ events: parachainStakingEventNames })
  .addCall('*', {
    data: { call: { origin: true } }
  } as const)
  .includeAllBlocks()

const processStaking = async (ctx: Context): Promise<void> => {
  const itemNames = ctx.blocks
    .map(b => b.items.filter(i => parachainStakingEventNames.includes(i.name)).map(i => i.name))
    .flat()
  if (itemNames.length > 0) {
    const blocks = ctx.blocks.map(b => b.header.height)
    ctx.log
      .child('staking')
      .debug(
        `[${blocks[0]}-${blocks[blocks.length - 1]}]: staking items` + JSON.stringify(itemNames)
      )
  }
}

processor.run(new TypeormDatabase(), processStaking)
