import { EventItem } from '@subsquid/substrate-processor/lib/interfaces/dataSelection'
export * from './data'

export type NftEventName =
  | 'NftManager.SingleNftMinted'
  | 'NftManager.BatchNftMinted'
  | 'NftManager.BatchCreated'
  | 'NftManager.FiatNftTransfer'
  | 'NftManager.EthNftTransfer'

export type NftMintEventItem = EventItem<
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

export type NftTransferEventItem = EventItem<
  'NftManager.BatchCreated' | 'NftManager.FiatNftTransfer' | 'NftManager.EthNftTransfer',
  { event: { args: true; call: {} } }
>

export type NftEventItem = NftMintEventItem | NftTransferEventItem
