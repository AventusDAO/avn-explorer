import { ChainGen } from '@avn/utils'

// NOTE: keep it in sync with the ES schema

interface EsItem {
  refId: string
  timestamp: number
  chainGen: ChainGen
}

export interface EsBlock extends EsItem {
  hash: string
  height: number
  extrCount: number
  signedExtrCount: number
}

export interface EsExtrinsic extends EsItem {
  hash: string
  blockHeight: number
  section: string
  method: string
  isSigned: boolean
  isProcessed: boolean
  isSuccess: boolean
  signer: string
  nonce: number
  proxySigner?: string
}

export interface EsEvent extends EsItem {
  blockHeight: number
  section: string
  name: string
}
