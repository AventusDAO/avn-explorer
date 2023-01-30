import { getProcessor } from '@avn/config'
import {
  BatchContext,
  BatchProcessorEventItem,
  BatchProcessorCallItem,
  BatchProcessorItem
} from '@subsquid/substrate-processor'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import { SummaryRoot } from './model'
import { BatchUpdates } from './services/batchUpdates'
import { getLastChainState, setChainState } from './services/chainState'
import { saveSummaries } from './services/summaries'
import { ParachainSummaryCallName } from './types/custom/calls'
import { ParachainSummaryEventName } from './types/custom/events'

type Item = BatchProcessorItem<typeof processor>
type EventItem = BatchProcessorEventItem<typeof processor>
type CallItem = BatchProcessorCallItem<typeof processor>
export type Context = BatchContext<Store, Item>

const SAVE_PERIOD = 12 * 60 * 60 * 1000
let lastStateTimestamp: number | undefined

const processor = getProcessor()
  .addEvent('Summary.VotingEnded', {
    data: { event: { args: true } }
  })
  .addCall('Summary.record_summary_calculation', { data: { call: { args: true } } })

const processSummary = async (ctx: Context): Promise<void> => {
  const pendingUpdates: BatchUpdates = new BatchUpdates(ctx)
  for (const block of ctx.blocks) {
    block.items
      .filter(item => (Object.values(ParachainSummaryCallName) as string[]).includes(item.name))
      .forEach((item: any) => {
        const summary = new SummaryRoot({
          toBlock: item.call.args.newBlockNumber,
          rootHash: item.call.args.rootHash
        })
        pendingUpdates.addSummaryRootFromCall(summary)
      }, pendingUpdates)

    block.items
      .filter(item => (Object.values(ParachainSummaryEventName) as string[]).includes(item.name))
      .forEach((item: any) => {
        const isValidated = item.event.args.voteApproved
        const toBlock = item.event.args.rootId.range.toBlock
        const fromBlock = item.event.args.rootId.range.fromBlock
        const summary = new SummaryRoot({
          isValidated,
          toBlock,
          fromBlock
        })

        pendingUpdates.addSummaryRootFromEvent(summary)
      }, pendingUpdates)

    if (lastStateTimestamp == null) {
      lastStateTimestamp = (await getLastChainState(ctx.store))?.timestamp.getTime() ?? 0
    }

    const updatesData = await pendingUpdates.getData()
    await saveSummaries(ctx, updatesData)
    await setChainState(ctx, block.header)

    lastStateTimestamp = block.header.timestamp
    pendingUpdates.clear()
  }
}

processor.run(new TypeormDatabase(), processSummary)
