import { EventItem as _EventItem } from '@subsquid/substrate-processor/lib/interfaces/dataSelection'

export type NftEventName =
  | 'NftManager.SingleNftMinted'
  | 'NftManager.BatchNftMinted'
  | 'NftManager.BatchCreated'
  | 'NftManager.FiatNftTransfer'
  | 'NftManager.EthNftTransfer'

type EventItem<T extends NftEventName, R> = _EventItem<T, R>

export type SingleNftMintedEventItem = EventItem<
  'NftManager.SingleNftMinted',
  {
    event: {
      args: true
      call: {
        args: true
      }
    }
  }
>

export type BatchNftMintedEventItem = EventItem<
  'NftManager.BatchNftMinted',
  {
    event: {
      args: true
      call: {
        args: true
      }
    }
  }
>

export type BatchCreatedEventItem = EventItem<
  'NftManager.BatchCreated',
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
  'NftManager.FiatNftTransfer' | 'NftManager.EthNftTransfer',
  { event: { args: true; call: false } }
>

export type NftEventItem =
  | SingleNftMintedEventItem
  | BatchNftMintedEventItem
  | BatchCreatedEventItem
  | NftTransferEventItem
