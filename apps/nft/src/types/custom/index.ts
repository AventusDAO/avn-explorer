import { EventItem } from '@subsquid/substrate-processor/lib/interfaces/dataSelection'

export interface MintedNftEventData {
  id: string
  nftId: bigint
  owner: string
}

export type NftEventItem =
  | EventItem<
      'NftManager.BatchCreated',
      { event: { args: true; extrinsic: { hash: true }; call: {} } }
    >
  | EventItem<
      'NftManager.SingleNftMinted',
      { event: { args: true; extrinsic: { hash: true }; call: {} } }
    >
  | EventItem<
      'NftManager.BatchNftMinted',
      { event: { args: true; extrinsic: { hash: true }; call: {} } }
    >
  | EventItem<
      'NftManager.FiatNftTransfer',
      { event: { args: true; extrinsic: { hash: true }; call: {} } }
    >
  | EventItem<
      'NftManager.EthNftTransfer',
      { event: { args: true; extrinsic: { hash: true }; call: {} } }
    >
