import { getProcessor } from '@avn/config'
import { BatchContext, BatchProcessorItem } from '@subsquid/substrate-processor'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import { saveErrors } from './services/errors'
import { ExtrinsicError } from './model'
import {
  getLastChainState,
  saveCurrentChainState,
  saveRegularChainState
} from './services/chainState'
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
        extrinsic: true,
        call: false
      }
    }
  })
  .addEvent('System.ExtrinsicFailed', {
    data: {
      event: {
        args: true,
        extrinsic: true,
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
        const args = item.event.args
        let error: string | undefined
        let index: number | undefined
        if (item.name === 'System.ExtrinsicFailed' || item.name === 'AvnProxy.InnerCallFailed') {
          if (args.dispatchError.__kind === 'Module' && args.dispatchError.value) {
            error = args.dispatchError.value.error
            index = args.dispatchError.value.index
          }
        }
        const extrinsic = item.event.extrinsic
        if (!extrinsic) throw new Error('extrinsic is not defined')
        if (!index || !error) throw new Error('index is not defined')
        const errorName = decodeError(index, error, block.header.height)
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
      await saveRegularChainState(ctx, block.header)

      lastStateTimestamp = block.header.timestamp
      pendingUpdates.clear()
    }
  }

  const block = ctx.blocks[ctx.blocks.length - 1]
  const updatesData = [...pendingUpdates.values()]
  await saveErrors(ctx, updatesData)
  await saveCurrentChainState(ctx, block.header)
  pendingUpdates.clear()
}

processor.run(new TypeormDatabase(), processErrors)
