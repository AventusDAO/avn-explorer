import { BatchContext, BatchProcessorItem } from '@subsquid/substrate-processor'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import { getProcessor } from '@avn/config'

const processor = getProcessor()

processor.run(new TypeormDatabase(), processEvents)

type Item = BatchProcessorItem<typeof processor>
export type Context = BatchContext<Store, Item>

async function processEvents(ctx: Context): Promise<void> {}
