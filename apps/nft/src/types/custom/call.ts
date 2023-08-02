import { CallItem } from '@subsquid/substrate-processor/lib/interfaces/dataSelection'
import { NftRoyalty } from '../../model'
import { NftMintEventItem } from './event'

export type MintCallItem = CallItem<'NftManager.SingleNftMinted', { call: { args: true } }>
export type NftMintEventCall = Required<NftMintEventItem['event']>['call']

export interface NftMintCallArgs {
  royalties: NftRoyalty[]
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
