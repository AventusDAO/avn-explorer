import { EsItem } from './common'

// NOTE: keep it in sync with the ES schema
export interface SearchExtrinsic extends EsItem {
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
