import { ChainGen } from '@avn/utils'

// NOTE: keep it in sync with the ES schema

interface EsItem {
  refId: string
  timestamp: number
  chainGen: ChainGen
  hash: string
}

export interface EsBlock extends EsItem {
  height: number
  extrCount: number
  signedExtrCount: number
}

export interface EsExtrinsic extends EsItem {
  blockHeight: number
  section: string
  method: string
  // TODO: signatures and nonces
  isSigned?: boolean
  // isSigned: boolean
  // isFailed: boolean
  // signer: string
  // nonce: number
  // proxySigner?: string
  // proxyNonce?: number
}

export interface EsEvent extends EsItem {
  blockHeight: number
  section: string
  name: string
}
