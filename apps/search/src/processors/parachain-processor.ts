import { getProcessor } from '@avn/config'
import { BatchContext, BatchProcessorItem } from '@subsquid/substrate-processor'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import { getElasticSearchClient } from '../elastic-search'
import { ElasticSearch } from '../elastic-search/elastic-search'

type Item = BatchProcessorItem<typeof processor>
export type Context = BatchContext<Store, Item>

const SAVE_PERIOD = 12 * 60 * 60 * 1000 // 12 hours
let lastStateTimestamp: number | undefined

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
        events: false
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
        events: false
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

let esClient: ElasticSearch | undefined

const handleBatch = async (ctx: Context): Promise<void> => {
  if (!esClient) {
    esClient = await getElasticSearchClient()
  }
  const blocksHeights = ctx.blocks.map(b => b.header.height)
  console.log(blocksHeights)
}

processor.run(new TypeormDatabase(), handleBatch)
