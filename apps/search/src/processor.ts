import { getProcessor } from '@avn/config'
import { ProxyCallArgs } from '@avn/types'
import { ChainGen, getChainGen } from '@avn/utils'
import {
  BatchContext,
  BatchProcessorItem,
  SubstrateBlock,
  BatchBlock
} from '@subsquid/substrate-processor'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import { getElasticSearch } from './elastic-search'
import { SearchBlock, SearchEvent, SearchExtrinsic } from './elastic-search/types'

type Item = BatchProcessorItem<typeof processor>
export type Context = BatchContext<Store, Item>

const processor = getProcessor()
  .addCall('AvnProxy.proxy', {
    data: {
      call: {
        args: true,
        error: true,
        origin: false,
        parent: false // fetch parent call data
      },
      extrinsic: {
        signature: true,
        success: true,
        fee: false,
        tip: false,
        call: false,
        calls: false,
        events: false,
        hash: true
      }
    }
  } as const)
  // NOTE: keep the data as small as possible for wildcard '*' queries.
  // otherwise you might overload the archive gateway and see pool timeouts
  .addCall('*', {
    data: {
      call: {
        args: false,
        error: true,
        origin: false,
        parent: false
      },
      extrinsic: {
        signature: true,
        success: true,
        fee: false,
        tip: false,
        call: false,
        calls: false,
        events: false,
        hash: true
      }
    }
  } as const)
  .addEvent('*', {
    data: {
      event: {
        args: false,
        extrinsic: false,
        call: false
      }
    }
  })

const mapChainGen = (block: BatchBlock<Item>): ChainGen => {
  const [specName, specVersion] = block.header.specId.split('@')
  return getChainGen({ specName, specVersion: Number(specVersion) })
}

const mapBlockBatch = (block: BatchBlock<Item>, extrinsics: SearchExtrinsic[]): SearchBlock => {
  const blockHeader: SubstrateBlock = block.header
  const { id, height, hash, timestamp } = blockHeader
  const chainGen = mapChainGen(block)

  return {
    refId: id,
    timestamp,
    chainGen,
    hash,
    height,
    extrCount: extrinsics.length,
    signedExtrCount: extrinsics.filter(e => e.isSigned).length
  }
}

const mapExtrinsics = (block: BatchBlock<Item>): SearchExtrinsic[] => {
  const blockHeader: SubstrateBlock = block.header
  const { height, timestamp } = blockHeader
  const chainGen = mapChainGen(block)

  // find AvnProxy.InnerCallFailed events in the block, to be used for determining extrinsic success status
  const innerCallFailedEvents = block.items.filter(
    item => item.kind === 'event' && (item.event.name as string) === 'AvnProxy.InnerCallFailed'
  )

  return block.items
    .filter(item => item.kind === 'call')
    .reduce((array, item) => {
      // just for type safety
      if (item.kind !== 'call') throw new Error(`item must be of 'call' kind`)
      // reduce the items array to a smaller array based on the extrinsic.id of the call
      // to get unique extrinsic items / avoid duplicating fees in utility.batchAll extrinsic
      const hasSameExtrinsicAlready =
        array.filter(i => i.kind === 'call' && i.extrinsic.id === item.extrinsic.id).length > 0
      if (!hasSameExtrinsicAlready) array.push(item)
      return array
    }, new Array<Item>())
    .map(item => {
      // just for type safety
      if (item.kind !== 'call') throw new Error(`item must be of 'call' kind`)
      const name = item.call.name
      const [section, method] = name.split('.')

      const signature = item.extrinsic.signature
      const isSigned = !!signature
      const signer = signature?.address?.value
      const nonce = signature?.signedExtensions?.CheckNonce
      const isProcessed = item.extrinsic.success

      const innerFailedEvent = innerCallFailedEvents.find(event => {
        if (event.kind !== 'event') return undefined
        if (event.event.call?.id === item.call.id) return event
        return undefined
      })
      const isSuccess = isProcessed && innerFailedEvent === undefined

      let proxySigner: string | undefined
      let proxyCallSection: string | undefined
      let proxyCallMethod: string | undefined
      if (item.name === 'AvnProxy.proxy') {
        const proxyArgs = item.call.args as ProxyCallArgs<unknown>
        proxySigner = proxyArgs.call.value.proof.signer
        proxyCallSection = proxyArgs.call.__kind
        proxyCallMethod = proxyArgs.call.value.__kind
      }

      return {
        refId: item.extrinsic.id,
        timestamp,
        chainGen,
        blockHeight: height,
        hash: item.extrinsic.hash,
        section,
        method,
        isSigned,
        isProcessed,
        isSuccess,
        signer,
        nonce,
        proxySigner,
        proxyCallSection,
        proxyCallMethod
      }
    })
}

const mapEvents = (block: BatchBlock<Item>): SearchEvent[] => {
  const blockHeader: SubstrateBlock = block.header
  const { height, timestamp } = blockHeader
  const chainGen = mapChainGen(block)

  return block.items
    .filter(item => item.kind === 'event')
    .map(item => {
      // just for type safety
      if (item.kind !== 'event') throw new Error(`item must be of 'event' kind`)
      const _name = item.event.name
      const [section, name] = _name.split('.')
      return {
        refId: item.event.id,
        timestamp,
        chainGen,
        blockHeight: height,
        section,
        name
      }
    })
}

const handleBatch = async (ctx: Context): Promise<void> => {
  const elasticSearch = getElasticSearch()

  const batchedBlocks: SearchBlock[] = []
  const batchedExtrinsics: SearchExtrinsic[] = []
  const batchedEvents: SearchEvent[] = []

  ctx.blocks.forEach(batchBlock => {
    const events = mapEvents(batchBlock)
    const extrinsics = mapExtrinsics(batchBlock)
    const block = mapBlockBatch(batchBlock, extrinsics)

    batchedBlocks.push(block)
    batchedExtrinsics.push(...extrinsics)
    batchedEvents.push(...events)
  })

  await elasticSearch.storeBatch(batchedBlocks, batchedExtrinsics, batchedEvents)
}

const main = async (): Promise<void> => {
  const elasticSearch = getElasticSearch()

  const isSetUp = await elasticSearch.isSetUp()
  if (!isSetUp) {
    await elasticSearch.setupIndexes()
  }

  processor.run(new TypeormDatabase(), handleBatch)
}

void main()
