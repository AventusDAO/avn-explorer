import { JsonCodec, TypeKind, Type } from '@subsquid/scale-codec'
// import { CodecType, CodecStructType } from '@subsquid/scale-codec/src/types-codec'
import { getNftTypes } from '@avn/metadata'
import { MigrationCallItem } from './types'

export const handleNftsMigration = (item: MigrationCallItem) => {
  // const meta = getMetadata('avn-parachain@31', 'versions.avn-parachain.dev.jsonl')
  const def = getNftTypes('avn-parachain@31', 'versions.avn-parachain.dev.jsonl')
  if (!def) throw new Error('lol')
  const composityType: Type = {
    kind: TypeKind.Composite,
    fields: def.value.fields
  }
  const codec = new JsonCodec([composityType])
  const decoded = codec.decode(0, item.call.args.nfts[0])
  return decoded
}
