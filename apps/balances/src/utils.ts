import * as ss58 from '@subsquid/ss58'
import { NetworkPrefix } from '@avn/config/lib/types'

export function encodeId(id: Uint8Array, prefix: NetworkPrefix): string {
  return ss58.codec(prefix).encode(id)
}
