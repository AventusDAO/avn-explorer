import { EventItem } from '@subsquid/substrate-processor/lib/interfaces/dataSelection'

export interface MintedNftEventData {
  id: string
  nftId: bigint
  owner: string
}

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
