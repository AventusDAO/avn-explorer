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
  proxyRelayer?: string
  proxyCallSection?: string
  proxyCallMethod?: string
  proxyRecipient?: string
  proxyPayer?: string
  proxyNodeManagerOwner?: string
  proxyNodeManagerNodeId?: string
  nftManagerProxyOwner?: string
  from?: string
  to?: string
  nodeManagerOwner?: string
  nodeManagerNodeId?: string
}
