import { getProcessor } from '@avn/config'
import { BatchContext, BatchProcessorItem } from '@subsquid/substrate-processor'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import { saveErrors } from './services/errors'
import { ExtrinsicError } from './model'
import { getLastChainState, saveChainState } from './services/chainState'
import { decodeError } from './services/metadata'

type Item = BatchProcessorItem<typeof processor>
export type Context = BatchContext<Store, Item>

const SAVE_PERIOD = 12 * 60 * 60 * 1000
let lastStateTimestamp: number

const processor = getProcessor()
  .addEvent('AvnProxy.InnerCallFailed', {
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
  .addEvent('System.ExtrinsicFailed', {
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

const processErrors = async (ctx: Context): Promise<void> => {
  const pendingUpdates = new Map<string, ExtrinsicError>()

  for (const block of ctx.blocks) {
    // get the accounts and the fees paid
    block.items
      .filter(item => item.kind === 'event')
      .filter(item => item.name !== '*')
      .map(item => {
        if (item.kind !== 'event') throw new Error(`item must be of 'event' kind`)
        if (item.name === '*') throw new Error('unexpected wildcard name')
        const extrinsic = item.event.extrinsic
        if (!extrinsic) throw new Error('extrinsic is not defined')

        const args = item.event.args
        let errorName: string = ''

        if (item.name === 'System.ExtrinsicFailed' || item.name === 'AvnProxy.InnerCallFailed') {
          if (args.dispatchError.__kind === 'Module' && args.dispatchError.value) {
            const error = args.dispatchError.value.error
            const index = args.dispatchError.value.index
            if (error === undefined) throw new Error('error is not defined')
            if (index === undefined) throw new Error('index is not defined')
            errorName = decodeError(index, error, block.header.specId)
          } else {
            errorName = args.dispatchError.__kind
          }
        }

        return new ExtrinsicError({
          id: extrinsic.id,
          extrinsicHash: extrinsic.hash,
          errorName
        })
      })
      .forEach(item => {
        pendingUpdates.set(item.id, item)
      }, pendingUpdates)

    if (lastStateTimestamp == null) {
      lastStateTimestamp = (await getLastChainState(ctx.store))?.timestamp.getTime() ?? 0
    }

    if (block.header.timestamp - lastStateTimestamp >= SAVE_PERIOD) {
      const updatesData = [...pendingUpdates.values()]
      await saveErrors(ctx, updatesData)
      await saveChainState(ctx, block.header)

      lastStateTimestamp = block.header.timestamp
      pendingUpdates.clear()
    }
  }

  const block = ctx.blocks[ctx.blocks.length - 1]
  const updatesData = [...pendingUpdates.values()]
  await saveErrors(ctx, updatesData)
  await saveChainState(ctx, block.header)
  pendingUpdates.clear()
}

processor.run(new TypeormDatabase(), processErrors)
