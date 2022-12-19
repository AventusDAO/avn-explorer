import { NetworkPrefix } from '@avn/config/lib/types'
import { AddressEncoded } from '@avn/types'
import { getConfig } from '@avn/config'
import { codec } from '@subsquid/ss58'
const config = getConfig()

export function encodeId(id: Uint8Array, prefix: NetworkPrefix = config.prefix): AddressEncoded {
  return codec(prefix).encode(id)
}
