import { getProcessor } from '@avn/config'
import { ChainGen, getChainGen } from '@avn/utils'
import {
  BatchContext,
  BatchProcessorItem,
  SubstrateBlock,
  BatchBlock
} from '@subsquid/substrate-processor'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import { getElasticSearchClient } from './elastic-search'
import { ElasticSearch } from './elastic-search/elastic-search'
import { EsBlock, EsEvent, EsExtrinsic } from './elastic-search/types'

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

const mapBlockBatch = (block: BatchBlock<Item>, extrinsics: EsExtrinsic[]): EsBlock => {
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

const mapExtrinsics = (block: BatchBlock<Item>): EsExtrinsic[] => {
  const blockHeader: SubstrateBlock = block.header
  const { height, timestamp } = blockHeader
  const chainGen = mapChainGen(block)

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
      return {
        refId: item.extrinsic.id,
        timestamp,
        chainGen,
        blockHeight: height,
        hash: item.extrinsic.hash,
        section,
        method
      }
    })
}


const mapEvents = (block: BatchBlock<Item>): EsEvent[] => {
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

let esClient: ElasticSearch | undefined
const handleBatch = async (ctx: Context): Promise<void> => {
  // TODO: refactor me for readability
  if (esClient === undefined) {
    esClient = await getElasticSearchClient()
  }

  const batchedBlocks: EsBlock[] = []
  const batchedExtrinsics: EsExtrinsic[] = []
  const batchedEvents: EsEvent[] = []

  ctx.blocks.forEach(batchBlock => {
    const events = mapEvents(batchBlock)
    const extrinsics = mapExtrinsics(batchBlock)
    const block = mapBlockBatch(batchBlock, extrinsics)

    batchedBlocks.push(block)
    batchedExtrinsics.push(...extrinsics)
    batchedEvents.push(...events)
  })

  await esClient.storeBatch(batchedBlocks, batchedExtrinsics, batchedEvents)
}

processor.run(new TypeormDatabase(), handleBatch)
