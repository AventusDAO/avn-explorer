import { BatchContext, BatchProcessorItem } from '@subsquid/substrate-processor'
import { EventItem } from '@subsquid/substrate-processor/lib/interfaces/dataSelection'
import { Store } from '@subsquid/typeorm-store'
import processor from './processor'

export interface TransferEventData {
  id: string
  blockNumber: number
  timestamp: Date
  extrinsicHash?: string
  from: Uint8Array
  to: Uint8Array
  pallet: string
  method: string
}
export interface NftTransferEventData extends TransferEventData {
  nftId: string
}

export interface TokenTransferEventData extends TransferEventData {
  amount: bigint
  tokenName: string | undefined
  tokenId: Uint8Array
}

export type TransferData = TokenTransferEventData | NftTransferEventData | undefined

export type Item = BatchProcessorItem<typeof processor>
export type Ctx = BatchContext<Store, Item>

export type TransfersEventItem =
  | EventItem<'Balances.Transfer', { event: { args: true; extrinsic: { hash: true }; call?: {} } }>
  | EventItem<'Balances.Endowed', { event: { args: true; extrinsic: { hash: true }; call?: {} } }>
  | EventItem<
      'Balances.BalanceSet',
      { event: { args: true; extrinsic: { hash: true }; call?: {} } }
    >
  | EventItem<'Balances.Reserved', { event: { args: true; extrinsic: { hash: true }; call?: {} } }>
  | EventItem<
      'Balances.Unreserved',
      { event: { args: true; extrinsic: { hash: true }; call?: {} } }
    >
  | EventItem<
      'Balances.ReserveRepatriated',
      { event: { args: true; extrinsic: { hash: true }; call?: {} } }
    >
  | EventItem<'Balances.Deposit', { event: { args: true; extrinsic: { hash: true }; call?: {} } }>
  | EventItem<'Balances.Withdraw', { event: { args: true; extrinsic: { hash: true }; call?: {} } }>
  | EventItem<'Balances.Slashed', { event: { args: true; extrinsic: { hash: true }; call?: {} } }>
  | EventItem<
      'TokenManager.TokenTransferred',
      { event: { args: true; extrinsic: { hash: true }; call?: {} } }
    >
  | EventItem<
      'TokenManager.TokenLifted',
      { event: { args: true; extrinsic: { hash: true }; call?: {} } }
    >
  | EventItem<
      'TokenManager.TokenLowered',
      { event: { args: true; extrinsic: { hash: true }; call?: {} } }
    >
  | EventItem<
      'NftManager.BatchCreated',
      { event: { args: true; extrinsic: { hash: true }; call?: {} } }
    >
  | EventItem<
      'NftManager.SingleNftMinted',
      { event: { args: true; extrinsic: { hash: true }; call?: {} } }
    >
  | EventItem<
      'NftManager.BatchNftMinted',
      { event: { args: true; extrinsic: { hash: true }; call?: {} } }
    >
  | EventItem<
      'NftManager.FiatNftTransfer',
      { event: { args: true; extrinsic: { hash: true }; call?: {} } }
    >

export type EventNormalizers = {
  [K in TransfersEventItem['name']]: EventNormalizer<EventItem<K, { event: { args: true } }>>
}

export type EventName =
  | 'Balances.Transfer'
  | 'Balances.Endowed'
  | 'Balances.BalanceSet'
  | 'Balances.Reserved'
  | 'Balances.Unreserved'
  | 'Balances.ReserveRepatriated'
  | 'Balances.Deposit'
  | 'Balances.Withdraw'
  | 'Balances.Slashed'
  | 'TokenManager.TokenTransferred'
  | 'TokenManager.TokenLifted'
  | 'TokenManager.TokenLowered'
  | 'NftManager.BatchCreated'
  | 'NftManager.SingleNftMinted'
  | 'NftManager.BatchNftMinted'
  | 'NftManager.FiatNftTransfer'

export type EventNormalizer<T extends TransfersEventItem & { call?: {} }> = (
  ctx: Ctx,
  item: T,
  avtHash?: string
) => T



  