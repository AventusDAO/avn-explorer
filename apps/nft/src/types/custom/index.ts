import { EventItem } from '@subsquid/substrate-processor/lib/interfaces/dataSelection'

export type NftEventName =
  | 'NftManager.SingleNftMinted'
  | 'NftManager.BatchNftMinted'
  | 'NftManager.BatchCreated'
  | 'NftManager.FiatNftTransfer'
  | 'NftManager.EthNftTransfer'

export type NftEventItem<NftEventName> =
  | EventItem<NftEventName, { event: { args: true; call: {} } }>
  | EventItem<
      'NftManager.SingleNftMinted' | 'NftManager.BatchNftMinted',
      {
        event: {
          args: true
          call: {
            args: true
          }
        }
      }
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

// TODO: remove and use NftMetadata instead
export type NftMintEventData = Pick<NftMetadata, 'id' | 'owner'>
