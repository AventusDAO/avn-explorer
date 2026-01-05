import { BatchContext, BatchProcessorItem } from '@subsquid/substrate-processor'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import { getProcessor } from '@avn/config'

const processor = getProcessor().addEvent('TokenManager.TokenTransferred', {
  data: {
    // provide the fields needed - event, call
    event: {
      args: true,
      extrinsic: {
        signature: true,
        hash: true
      },
      call: { origin: true, args: true }
    }
  }
} as const)

export type Item = BatchProcessorItem<typeof processor>
export type Ctx = BatchContext<Store, Item>

async function main(ctx: Ctx): Promise<void> {
  for (const block of ctx.blocks) {
    for (const item of block.items) {
      if (item.kind === 'call') {
        // ... processing calls
      }

      if (item.kind === 'event') {
        // ... processing events
      }

      //   store each item
      //   with ctx.store.save(...)
    }

    //   with ctx.store.save(...)
  }

  //   with ctx.store.save(...)
}

processor.run(new TypeormDatabase(), main)
