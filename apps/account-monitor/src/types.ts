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
  relayer: Uint8Array | undefined
  payer: Uint8Array | undefined
  nonce: bigint
}
export interface NftTransferEventData extends TransferEventData {
  nftId: string
}

export interface TokenTransferEventData extends TransferEventData {
  amount: bigint
  tokenName: string | undefined
  tokenId: Uint8Array
  scheduleName: Uint8Array | undefined
  senderNonce: bigint | undefined
  t1Recipient: Uint8Array | undefined
  lowerId: number | undefined
}

export type TransferData = TokenTransferEventData | NftTransferEventData | undefined

export type Item = BatchProcessorItem<typeof processor>
export type Ctx = BatchContext<Store, Item>

export type TransfersEventItem = EventItem<
  EventName,
  {
    event: {
      args: true
      extrinsic: { hash: true; signature: true }
      call: { origin: true; args: true }
    }
  }
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
  | 'TokenManager.AvtLowered'
  | 'TokenManager.AVTLifted'
  | 'TokenManager.LowerRequested'
  | 'NftManager.BatchCreated'
  | 'NftManager.SingleNftMinted'
  | 'NftManager.BatchNftMinted'
  | 'NftManager.FiatNftTransfer'
  | 'NftManager.EthNftTransfer'

export const schedulerEventNames = [
  'Scheduler.Scheduled',
  'Scheduler.Dispatched',
  'Scheduler.Canceled'
]

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
  'TokenManager.AvtLowered',
  'TokenManager.AVTLifted',
  'TokenManager.LowerRequested',
  'NftManager.BatchCreated',
  'NftManager.SingleNftMinted',
  'NftManager.BatchNftMinted',
  'NftManager.FiatNftTransfer',
  'NftManager.EthNftTransfer'
]

export const transactionEvents = [
  'EthereumEvents.EthereumEventAdded',
  'EthereumEvents.NftEthereumEventAdded',
  'EthBridge.EventRejected',
  'EthBridge.EventAccepted'
]

export type EventNormalizer<T extends TransfersEventItem> = (
  ctx: Ctx,
  item: T,
  avtHash?: string
) =>
  | {
      from: Uint8Array | undefined
      to: Uint8Array | undefined
      amount: bigint
      tokenId: Uint8Array
      payer?: Uint8Array
      lowerId?: number
      scheduleName?: Uint8Array
      senderNonce?: bigint | undefined
      t1Recipient?: Uint8Array
    }
  | {
      from: Uint8Array | undefined
      to: Uint8Array
      nftId: bigint
      totalSupply: number | bigint
      payer?: Uint8Array
    }

export type BalanceType = {
  free: bigint
  reserved: bigint
}
