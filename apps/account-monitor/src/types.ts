import { BatchContext, BatchProcessorItem } from '@subsquid/substrate-processor'
import { EventItem } from '@subsquid/substrate-processor/lib/interfaces/dataSelection'
import { Store } from '@subsquid/typeorm-store'
import processor from './processor'

// Base transfer event interface
export interface BaseTransferEvent {
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

// Specific transfer event types extending the base interface
export interface NftTransferEventData extends BaseTransferEvent {
  nftId: string
}

export interface TokenTransferEventData extends BaseTransferEvent {
  amount: bigint
  tokenName: string | undefined
  tokenId: Uint8Array
  scheduleName: Uint8Array | undefined
  senderNonce: bigint | undefined
  t1Recipient: Uint8Array | undefined
  lowerId: number | undefined
}

// Consolidated event categories
const eventCategories = {
  balances: [
    'Transfer',
    'Endowed',
    'BalanceSet',
    'Reserved',
    'Unreserved',
    'ReserveRepatriated',
    'Deposit',
    'Withdraw',
    'Slashed'
  ],
  tokenManager: [
    'TokenTransferred',
    'TokenLifted',
    'TokenLowered',
    'AvtLowered',
    'AVTLifted',
    'LowerRequested'
  ],
  nftManager: [
    'BatchCreated',
    'SingleNftMinted',
    'BatchNftMinted',
    'FiatNftTransfer',
    'EthNftTransfer'
  ],
  scheduler: ['Scheduled', 'Dispatched', 'Canceled'],
  ethereum: ['EthereumEventAdded', 'NftEthereumEventAdded'],
  ethBridge: ['EventRejected', 'EventAccepted']
} as const

// Generate fully qualified event names
const generateEventNames = (category: string, events: readonly string[]): string[] =>
  events.map(event => `${category}.${event}`)

// Export event name types and arrays
export type EventName =
  | `Balances.${typeof eventCategories.balances[number]}`
  | `TokenManager.${typeof eventCategories.tokenManager[number]}`
  | `NftManager.${typeof eventCategories.nftManager[number]}`

export const schedulerEventNames = generateEventNames('Scheduler', eventCategories.scheduler)
export const eventNames = [
  ...generateEventNames('Balances', eventCategories.balances),
  ...generateEventNames('TokenManager', eventCategories.tokenManager),
  ...generateEventNames('NftManager', eventCategories.nftManager)
]
export const transactionEvents = [
  ...generateEventNames('EthereumEvents', eventCategories.ethereum),
  ...generateEventNames('EthBridge', eventCategories.ethBridge)
]

// Processor types
export type Item = BatchProcessorItem<typeof processor>
export type Ctx = BatchContext<Store, Item>

// Event types
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

// Token transfer normalizer return type
type TokenTransferNormalized = {
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

// NFT transfer normalizer return type
type NftTransferNormalized = {
  from: Uint8Array | undefined
  to: Uint8Array
  nftId: bigint
  totalSupply: number | bigint
  payer?: Uint8Array
}

// Event normalizer types
export type EventNormalizer<T extends TransfersEventItem> = (
  ctx: Ctx,
  item: T,
  avtHash?: string
) => TokenTransferNormalized | NftTransferNormalized

export type EventNormalizers = {
  [K in TransfersEventItem['name']]: EventNormalizer<Extract<TransfersEventItem, { name: K }>>
}

export type BalanceType = {
  free: bigint
  reserved: bigint
}

export type TransferData = TokenTransferEventData | NftTransferEventData | undefined
