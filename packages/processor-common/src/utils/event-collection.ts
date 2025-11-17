export interface ProcessableItem {
  kind: 'event' | 'call'
  name: string
  [key: string]: any
}

export interface CollectedEvent<T = any> {
  item: T
  index: number
  blockTimestamp?: number
  blockHeight?: number
}

export function collectEvents<T extends ProcessableItem>(
  items: T[],
  eventNames: string[],
  options: {
    includeMetadata?: boolean
    blockTimestamp?: number
    blockHeight?: number
  } = {}
): CollectedEvent<T>[] {
  const { includeMetadata = false, blockTimestamp, blockHeight } = options
  const events: CollectedEvent<T>[] = []
  let eventIndex = 0

  for (const item of items) {
    if (item.kind === 'event' && eventNames.includes(item.name)) {
      const collected: CollectedEvent<T> = {
        item,
        index: eventIndex++
      }

      if (includeMetadata) {
        if (blockTimestamp !== undefined) {
          collected.blockTimestamp = blockTimestamp
        }
        if (blockHeight !== undefined) {
          collected.blockHeight = blockHeight
        }
      }

      events.push(collected)
    }
  }

  return events
}

export function collectCalls<T extends ProcessableItem>(
  items: T[],
  callNames: string[],
  options: {
    includeMetadata?: boolean
    blockTimestamp?: number
    blockHeight?: number
  } = {}
): CollectedEvent<T>[] {
  const { includeMetadata = false, blockTimestamp, blockHeight } = options
  const calls: CollectedEvent<T>[] = []
  let callIndex = 0

  for (const item of items) {
    if (item.kind === 'call' && callNames.includes(item.name)) {
      const collected: CollectedEvent<T> = {
        item,
        index: callIndex++
      }

      if (includeMetadata) {
        if (blockTimestamp !== undefined) {
          collected.blockTimestamp = blockTimestamp
        }
        if (blockHeight !== undefined) {
          collected.blockHeight = blockHeight
        }
      }

      calls.push(collected)
    }
  }

  return calls
}

export function filterItems<T extends ProcessableItem>(
  items: T[],
  predicate: (item: T) => boolean
): T[] {
  return items.filter(predicate)
}

export function isEvent(item: ProcessableItem): boolean {
  return item.kind === 'event'
}

export function isCall(item: ProcessableItem): boolean {
  return item.kind === 'call'
}

export function matchesAnyName(item: ProcessableItem, names: string[]): boolean {
  return names.includes(item.name)
}
