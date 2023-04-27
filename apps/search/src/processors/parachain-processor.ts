import { getProcessor } from '@avn/config'
import { BatchContext, BatchProcessorItem } from '@subsquid/substrate-processor'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'

type Item = BatchProcessorItem<typeof processor>
export type Context = BatchContext<Store, Item>

const SAVE_PERIOD = 12 * 60 * 60 * 1000 // 12 hours
let lastStateTimestamp: number | undefined

const processor = getProcessor().addCall('*', {
  data: {
    call: {
      args: true,
      error: true,
      origin: false,
      events: false,
      // success: true, // fetch the success status
      parent: false // fetch the parent call data
    },
    // the extrisic initiated the call
    extrinsic: {
      signature: true,
      success: true, // fetch the extrinsic success status
      fee: false,
      tip: false,
      call: false,
      calls: false,
      events: false
    }
  }
} as const)

const handleBatch = async (ctx: Context): Promise<void> => {
  console.log(ctx.blocks.map(b => b.items.length))
}

processor.run(new TypeormDatabase(), handleBatch)
