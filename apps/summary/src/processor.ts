import { getProcessor } from '@avn/config'
import {
  BatchContext,
  BatchProcessorEventItem,
  BatchProcessorItem
} from '@subsquid/substrate-processor'
import { Store } from '@subsquid/typeorm-store'

type Item = BatchProcessorItem<typeof processor>
type EventItem = BatchProcessorEventItem<typeof processor>
export type Context = BatchContext<Store, Item>

const processor = getProcessor()
  .addEvent('Summary.VotingEnded', {
    data: { event: { args: true } }
  })
  .addCall('Summary.record_summary_calculation', { data: { call: { args: true } } })

const processSummary = async (ctx: Context): Promise<void> => {}
