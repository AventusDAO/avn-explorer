import { SubstrateBlock } from '@subsquid/substrate-processor'
import { collectEvents, CollectedEvent } from '../utils/event-collection'
import { StandardErrorHandler } from './processor-initializer'

export function collectBlockEvents<T extends { kind: string; name: string }>(
  block: { items: T[]; header: { timestamp: number; height: number } },
  eventNames: string[]
): CollectedEvent<T>[] {
  const collected = collectEvents(block.items as any, eventNames, {
    includeMetadata: true,
    blockTimestamp: block.header.timestamp,
    blockHeight: block.header.height
  })
  return collected as CollectedEvent<T>[]
}

export async function processBlockEvents<TEvent, TResult>(
  events: CollectedEvent<TEvent>[],
  processor: (event: TEvent, index: number) => Promise<TResult>,
  errorHandler: StandardErrorHandler,
  blockHeight: number,
  options: {
    concurrency?: number
    filterNulls?: boolean
  } = {}
): Promise<TResult[]> {
  const { concurrency = 10, filterNulls = true } = options
  const { processInParallel } = require('../utils/concurrency')
  const { CONCURRENCY_CONFIG } = require('../utils/constants')

  const results = await processInParallel(
    events,
    async (collected: CollectedEvent<TEvent>) => {
      try {
        return await processor(collected.item, collected.index)
      } catch (error) {
        errorHandler.handleEventError(
          error,
          blockHeight,
          (collected.item as any).name || 'unknown',
          'event processing'
        )
        return null
      }
    },
    {
      concurrency: concurrency || CONCURRENCY_CONFIG.EVENT_PROCESSING,
      onError: (error: Error, collected: CollectedEvent<TEvent>) => {
        errorHandler.handleEventError(error, blockHeight, (collected.item as any).name || 'unknown')
      }
    }
  )

  if (filterNulls) {
    return results.filter((r: TResult | null): r is TResult => r !== null)
  }

  return results
}
