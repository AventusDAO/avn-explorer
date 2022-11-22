import * as ss58 from '@subsquid/ss58'
import { ProcessorConfig } from './types/custom/processorConfig'
export function encodeId(id: Uint8Array, config: ProcessorConfig) {
    return ss58.codec(config.prefix).encode(id)
}
