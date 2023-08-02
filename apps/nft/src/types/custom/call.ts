import { CallItem } from '@subsquid/substrate-processor/lib/interfaces/dataSelection'

export type MintCallItem = CallItem<'NftManager.SingleNftMinted', { call: { args: true } }>

export interface NftMintCallArgs {
  royalties: Array<{
    rate: {
      partsPerMillion: number
    }
    recipientT1Address: string
  }>
  t1Authority: string
  uniqueExternalRef: string
}

export interface ProxyCallArgs<A> {
  call: {
    value: A & ProxyCallProof
  }
  paymentInfo: {
    payer: string
    amount: string
    recipient: string
    signature: {
      value: string
    }
  }
}

export interface ProxyCallProof {
  signer: string
  relayer: string
  signature: {
    value: string
  }
}
