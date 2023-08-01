import { EventItem } from '@subsquid/substrate-processor/lib/interfaces/dataSelection'

export type NftEventName =
  | 'NftManager.BatchCreated'
  | 'NftManager.SingleNftMinted'
  | 'NftManager.BatchNftMinted'
  | 'NftManager.FiatNftTransfer'
  | 'NftManager.EthNftTransfer'

export type NftEventItem<NftEventName> = EventItem<
  NftEventName,
  { event: { args: true; extrinsic: { hash: true }; call: {} } }
>

export interface NftRoyalty {
  rate: {
    partsPerMillion: number
  }
  recipientT1Address: string
}

export interface NftMetadata {
  id: string
  mintBlock: number
  mintDate: Date
  owner: string
  t1Authority: string
  royalties: NftRoyalty[]
  uniqueExternalRef: string
}

export type NftMintEventData = Pick<NftMetadata, 'id' | 'owner'>
