import { getProcessor } from '@avn/config'
import { BatchContext, BatchProcessorItem, decodeHex } from '@subsquid/substrate-processor'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import { getLastChainState, setChainState } from '../services/chainState'
import { encodeId } from '@avn/utils'
import { AddressHex } from '@avn/types'

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
      // success: true, // fetch the success status
      parent: false // fetch the parent call data
    },
    // the extrisic initiated the call
    extrinsic: {
      signature: true,
      success: true, // fetch the extrinsic success status
      fee: true,
      tip: true
    }
  }
} as const)

const processFees = async (ctx: Context): Promise<void> => {
  for (const block of ctx.blocks) {
    // get the accounts and the fees paid
    block.items
      .filter(item => item.kind === 'call' && !!item.extrinsic.signature?.address)
      .forEach(item => {
        if (item.kind !== 'call') {
          throw new Error(`item must be of 'call' kind`)
        }
        const gasPaid = (item.extrinsic.fee ?? 0n) + (item.extrinsic.tip ?? 0n)
        const addressHex: AddressHex = item.extrinsic.signature?.address.value
        if (!addressHex) throw new Error('missing signature account')
        const address = encodeId(decodeHex(addressHex))
        ctx.log.debug(`address ${address} paid ${gasPaid} at #${block.header.height}`)
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
