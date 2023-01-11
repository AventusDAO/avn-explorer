import { getProcessor } from '@avn/config'
import { BatchContext, BatchProcessorItem } from '@subsquid/substrate-processor'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import { feesEventHandlers } from '../handlers/feesHandler'
import { saveAccounts } from '../services/accounts'
import { BatchUpdates } from '../services/batchUpdates'
import { getLastChainState, setChainState } from '../services/chainState'

type Item = BatchProcessorItem<typeof processor>
export type Context = BatchContext<Store, Item>

const SAVE_PERIOD = 12 * 60 * 60 * 1000
let lastStateTimestamp: number | undefined

const processor = getProcessor().addEvent('TransactionPayment.TransactionFeePaid', {
  data: {
    event: {
      args: true,
      extrinsic: false,
      call: false
    }
  }
})

const processFees = async (ctx: Context): Promise<void> => {
  const pendingUpdates: BatchUpdates = new BatchUpdates()

  for (const block of ctx.blocks) {
    // get the accounts and the fees paid
    block.items
      .filter(item => item.kind === 'event')
      .filter(item => item.name !== '*')
      .map(item => {
        if (item.kind !== 'event') throw new Error(`item must be of 'event' kind`)
        if (item.name === '*') throw new Error('unexpected wildcard name')
        const handler = feesEventHandlers[item.name]
        const data = handler(ctx, item.event)
        return data
      })
      .forEach(pendingUpdates.addFeePaid, pendingUpdates)

    if (lastStateTimestamp == null) {
      lastStateTimestamp = (await getLastChainState(ctx.store))?.timestamp.getTime() ?? 0
    }

    if (block.header.timestamp - lastStateTimestamp >= SAVE_PERIOD) {
      const updatesData = await pendingUpdates.getAllData()
      await saveAccounts(ctx, block.header, updatesData)
      await setChainState(ctx, block.header)

      lastStateTimestamp = block.header.timestamp
      pendingUpdates.clear()
    }
  }

  const block = ctx.blocks[ctx.blocks.length - 1]
  const updatesData = await pendingUpdates.getAllData()
  await saveAccounts(ctx, block.header, updatesData)
  await setChainState(ctx, block.header)
  pendingUpdates.clear()
}

processor.run(new TypeormDatabase(), processFees)
