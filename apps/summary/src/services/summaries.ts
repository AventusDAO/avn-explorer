import { In } from 'typeorm'
import { SummaryRoot } from '../model'
import { Context } from '../processor'

export async function saveSummaries(ctx: Context, updates: SummaryRoot[]): Promise<void> {
  const existingSummaries = await ctx.store.find(SummaryRoot, {
    where: { toBlock: In(updates.map((item: SummaryRoot) => item.toBlock)) }
  })

  const summaries = updates.map(summary => {
    const existingSummary = existingSummaries.find(s => s.toBlock === summary.toBlock)
    if (existingSummary) {
      return new SummaryRoot({
        isValidated: summary.isValidated || existingSummary.isValidated,
        rootHash: existingSummary.rootHash ?? summary.rootHash,
        toBlock: summary.toBlock,
        fromBlock: summary.fromBlock ? summary.fromBlock : existingSummary.fromBlock,
        id: existingSummary.id
      })
    } else {
      return summary
    }
  })

  await ctx.store.save(summaries)
  ctx.log.child('summaries').info(`updated: ${[...updates.values()].length}`)
}
