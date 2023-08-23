import { JsonCodec } from '@subsquid/scale-codec'
// import { CodecType, CodecStructType } from '@subsquid/scale-codec/src/types-codec'
import { getNftTypes } from '@avn/metadata'
import { MigrationCallItem } from './types'

export const handleNftsMigration = (item: MigrationCallItem) => {
  // const meta = getMetadata('avn-parachain@31', 'versions.avn-parachain.dev.jsonl')
  const def = getNftTypes('avn-parachain@31', 'versions.avn-parachain.dev.jsonl')
  console.log('woooooow')
  if (!def) throw new Error('lol')
  const composityType = {
    kind: def.__kind,
    fields: def.value
  }
  // const codec = new JsonCodec([composityType])
  // const decoded = codec.decode(0, item.call.args[1])
  // return decoded
}
