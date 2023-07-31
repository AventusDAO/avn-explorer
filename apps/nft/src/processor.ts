import { TypeormDatabase } from '@subsquid/typeorm-store'
import { getProcessor } from '@avn/config'

const processor = getProcessor()

processor.run(new TypeormDatabase(), processEvents)

async function processEvents(ctx: Ctx): Promise<void> {}
