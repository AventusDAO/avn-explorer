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
  payer: Uint8Array
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
  | EventItem<
      'Balances.Transfer',
      { event: { args: true; extrinsic: { hash: true }; call: { origin: true } } }
    >
  | EventItem<
      'Balances.Endowed',
      { event: { args: true; extrinsic: { hash: true }; call: { origin: true } } }
    >
  | EventItem<
      'Balances.BalanceSet',
      { event: { args: true; extrinsic: { hash: true }; call: { origin: true } } }
    >
  | EventItem<
      'Balances.Reserved',
      { event: { args: true; extrinsic: { hash: true }; call: { origin: true } } }
    >
  | EventItem<
      'Balances.Unreserved',
      { event: { args: true; extrinsic: { hash: true }; call: { origin: true } } }
    >
  | EventItem<
      'Balances.ReserveRepatriated',
      { event: { args: true; extrinsic: { hash: true }; call: { origin: true } } }
    >
  | EventItem<
      'Balances.Deposit',
      { event: { args: true; extrinsic: { hash: true }; call: { origin: true } } }
    >
  | EventItem<
      'Balances.Withdraw',
      { event: { args: true; extrinsic: { hash: true }; call: { origin: true } } }
    >
  | EventItem<
      'Balances.Slashed',
      { event: { args: true; extrinsic: { hash: true }; call: { origin: true } } }
    >
  | EventItem<
      'TokenManager.TokenTransferred',
      { event: { args: true; extrinsic: { hash: true }; call: { origin: true } } }
    >
  | EventItem<
      'TokenManager.TokenLifted',
      { event: { args: true; extrinsic: { hash: true }; call: { origin: true } } }
    >
  | EventItem<
      'TokenManager.TokenLowered',
      { event: { args: true; extrinsic: { hash: true }; call: { origin: true } } }
    >
  | EventItem<
      'NftManager.BatchCreated',
      { event: { args: true; extrinsic: { hash: true }; call: { origin: true } } }
    >
  | EventItem<
      'NftManager.SingleNftMinted',
      { event: { args: true; extrinsic: { hash: true }; call: { origin: true } } }
    >
  | EventItem<
      'NftManager.BatchNftMinted',
      { event: { args: true; extrinsic: { hash: true }; call: { origin: true } } }
    >
  | EventItem<
      'NftManager.FiatNftTransfer',
      { event: { args: true; extrinsic: { hash: true }; call: { origin: true } } }
    >
  | EventItem<
      'NftManager.EthNftTransfer',
      { event: { args: true; extrinsic: { hash: true }; call: { origin: true } } }
    >

export type EventNormalizers = {
  [K in TransfersEventItem['name']]: EventNormalizer<Extract<TransfersEventItem, { name: K }>>
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
  | 'NftManager.EthNftTransfer'

export const eventNames = [
  'Balances.Transfer',
  'Balances.Endowed',
  'Balances.BalanceSet',
  'Balances.Reserved',
  'Balances.Unreserved',
  'Balances.ReserveRepatriated',
  'Balances.Deposit',
  'Balances.Withdraw',
  'Balances.Slashed',
  'TokenManager.TokenTransferred',
  'TokenManager.TokenLifted',
  'TokenManager.TokenLowered',
  'NftManager.BatchCreated',
  'NftManager.SingleNftMinted',
  'NftManager.BatchNftMinted',
  'NftManager.FiatNftTransfer',
  'NftManager.EthNftTransfer'
]

export type EventNormalizer<T extends TransfersEventItem> = (
  ctx: Ctx,
  item: T,
  avtHash?: string
) =>
  | { from: Uint8Array | undefined; to: Uint8Array; amount: bigint; tokenId: Uint8Array }
  | { from: Uint8Array | undefined; to: Uint8Array; nftId: bigint; totalSupply: number | bigint }

export type BalanceType = {
  free: bigint
  reserved: bigint
}
