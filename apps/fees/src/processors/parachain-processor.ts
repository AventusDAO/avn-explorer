import { getProcessor } from '@avn/config'
import { BatchContext, BatchProcessorItem } from '@subsquid/substrate-processor'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import { getLastChainState, setChainState } from '../services/chainState'

type Item = BatchProcessorItem<typeof processor>
export type Context = BatchContext<Store, Item>

const SAVE_PERIOD = 12 * 60 * 60 * 1000
let lastStateTimestamp: number | undefined

const processor = getProcessor().addEvent('transactionPayment.TransactionFeePaid')

const processFees = async (ctx: Context): Promise<void> => {
  for (const block of ctx.blocks) {
    // get the accounts and the fees paid
    block.items
      .filter(item => item.kind === 'event')
      .forEach(item => {
        if (item.kind !== 'event') {
          throw new Error(`item must be of 'event' kind`)
        }
        if (item.event.name === 'transactionPayment.TransactionFeePaid') {
          console.log(item.event)
        }
      })

    if (lastStateTimestamp == null) {
      lastStateTimestamp = (await getLastChainState(ctx.store))?.timestamp.getTime() ?? 0
    }

    if (block.header.timestamp - lastStateTimestamp >= SAVE_PERIOD) {
      await setChainState(ctx, block.header)
      lastStateTimestamp = block.header.timestamp
    }
  }

  const block = ctx.blocks[ctx.blocks.length - 1]
  await setChainState(ctx, block.header)
}

processor.run(new TypeormDatabase(), processFees)
