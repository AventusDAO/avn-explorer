import { getProcessor } from '@avn/config'
import {
  BatchContext,
  BatchProcessorCallItem,
  BatchProcessorEventItem,
  BatchProcessorItem,
  SubstrateBlock
} from '@subsquid/substrate-processor'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'

const eventsList = [
  'Staking.Reward',
  'Staking.Slash',
  'Staking.Bonded',
  'Staking.Unbonded',
  'Staking.Withdrawn'
]

type Item = BatchProcessorItem<typeof processor>
type EventItem = BatchProcessorEventItem<typeof processor>
type CallItem = BatchProcessorCallItem<typeof processor>
type Context = BatchContext<Store, Item>

const processor = getProcessor({ events: eventsList })
  .addCall('*', {
    data: { call: { origin: true } }
  } as const)
  .includeAllBlocks()

const processStaking = async (ctx: Context): Promise<void> => {
  ctx.log.child('processor').debug(ctx.blocks.map(b => b.items))
}

processor.run(new TypeormDatabase(), processStaking)
