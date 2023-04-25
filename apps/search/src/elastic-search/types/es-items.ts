import { ChainGen } from '@avn/utils'

// NOTE: keep it in sync with the ES schema

interface EsItem {
  refId: string
  timestamp: bigint
  chainGen: ChainGen
  hash: string
}

export interface EsBlock extends EsItem {
  height: number
  txCount: number
  exCount: number
}

export interface EsExtrinsic extends EsItem {
  blockHeight: number
  section: string
  method: string
  isSigned: boolean
  isFailed: boolean
}

export interface EsEvent extends EsItem {
  blockHeight: number
  section: string
  name: string
}
