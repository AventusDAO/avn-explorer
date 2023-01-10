import { getProcessor } from '@avn/config'
import { BatchContext, BatchProcessorItem, decodeHex } from '@subsquid/substrate-processor'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import { getLastChainState, setChainState } from '../services/chainState'
import { AddressHex } from '@avn/types'
import { BatchUpdates } from '../services/batchUpdates'
import { IFeePaidData } from '../types/custom'
import { saveAccounts } from '../services/accounts'
import { encodeId } from '@avn/utils'

type Item = BatchProcessorItem<typeof processor>
export type Context = BatchContext<Store, Item>

const SAVE_PERIOD = 12 * 60 * 60 * 1000
let lastStateTimestamp: number | undefined

const processor = getProcessor().addCall('*', {
  data: {
    call: {
      args: false,
      error: false,
      origin: false,
      events: false,
      // success: true, // fetch the success status
      parent: false // fetch the parent call data
    },
    // the extrisic initiated the call
    extrinsic: {
      signature: true,
      success: true, // fetch the extrinsic success status
      fee: true,
      tip: true,
      call: false,
      calls: false,
      events: false
    }
  }
} as const)

const processFees = async (ctx: Context): Promise<void> => {
  const pendingUpdates: BatchUpdates = new BatchUpdates()

  for (const block of ctx.blocks) {
    // get the accounts and the fees paid
    block.items
      .filter(item => item.kind === 'call' && !!item.extrinsic.signature?.address)
      .map(item => {
        if (item.kind !== 'call') {
          throw new Error(`item must be of 'call' kind`)
        }
        const addressHex: AddressHex = item.extrinsic.signature?.address.value
        const address = decodeHex(addressHex)
        const fee: bigint = item.extrinsic.fee ?? 0n
        const tip: bigint = item.extrinsic.tip ?? 0n
        const data: IFeePaidData = {
          who: address,
          actualFee: fee + tip,
          tip
        }
        return data
      })
      .forEach(pendingUpdates.addFeePaid, pendingUpdates)

    if (lastStateTimestamp == null) {
      lastStateTimestamp = (await getLastChainState(ctx.store))?.timestamp.getTime() ?? 0
    }

    if (block.header.timestamp - lastStateTimestamp >= SAVE_PERIOD) {
      const updatesData = await pendingUpdates.getAllData()
      await saveAccounts(ctx, block.header, updatesData)
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
