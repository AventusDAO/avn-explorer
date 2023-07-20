import { getProcessor } from '@avn/config'
import { BatchContext, BatchProcessorItem } from '@subsquid/substrate-processor'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import { feesEventHandlers } from '../handlers/feesHandler'
import { saveAccounts } from '../services/accounts'
import { BatchUpdates } from '../services/batchUpdates'
import { getLastChainState, setChainState } from '../services/chainState'
import { IFeePaidAdjustedData, IFeePaidData } from '../types/custom'

type Item = BatchProcessorItem<typeof processor>
export type Context = BatchContext<Store, Item>

const SAVE_PERIOD = 12 * 60 * 60 * 1000
let lastStateTimestamp: number | undefined

const processor = getProcessor()
  .addEvent('TransactionPayment.TransactionFeePaid', {
    data: {
      event: {
        args: true,
        extrinsic: {
          hash: true
        },
        call: false
      }
    }
  })
  .addEvent('AvnTransactionPayment.AdjustedTransactionFeePaid', {
    data: {
      event: {
        args: true,
        extrinsic: {
          hash: true
        },
        call: false
      }
    }
  })

const processFees = async (ctx: Context): Promise<void> => {
  const pendingUpdates: BatchUpdates = new BatchUpdates()

  for (const block of ctx.blocks) {
    // get the accounts and the fees paid
    const feePaidArray = block.items
      .filter(item => item.kind === 'event')
      .filter(item => item.name === 'TransactionPayment.TransactionFeePaid')
      .map(item => {
        if (item.kind !== 'event') throw new Error(`item must be of 'event' kind`)
        if (item.name !== 'TransactionPayment.TransactionFeePaid')
          throw new Error('unexpected event name')
        const handler = feesEventHandlers[item.name]
        const data = handler(ctx, item.event) as IFeePaidData
        return data
      })

    // adjust the paid fee data
    block.items
      .filter(item => item.kind === 'event')
      .filter(item => item.name === 'AvnTransactionPayment.AdjustedTransactionFeePaid')
      .map(item => {
        if (item.kind !== 'event') throw new Error(`item must be of 'event' kind`)
        if (item.name !== 'AvnTransactionPayment.AdjustedTransactionFeePaid')
          throw new Error('unexpected event name')
        const handler = feesEventHandlers[item.name]
        const data = handler(ctx, item.event) as IFeePaidAdjustedData
        return data
      })
      .forEach(feeAdjusted => {
        const { extrinsic } = feeAdjusted
        if (extrinsic) {
          const feePaid = feePaidArray.find(f => f.extrinsic?.hash === feeAdjusted.extrinsic?.hash)
          if (!feePaid)
            throw new Error('TransactionFeePaid event not found for AdjustedTransactionFeePaid')
          feePaid.actualFee = feeAdjusted.fee + feePaid.tip
        }
      })

    feePaidArray.forEach(pendingUpdates.addFeePaid, pendingUpdates)

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
