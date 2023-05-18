import { EsItem } from './common'

// NOTE: keep it in sync with the ES schema
export interface SearchBlock extends EsItem {
  hash: string
  height: number
  extrCount: number
  signedExtrCount: number
}
