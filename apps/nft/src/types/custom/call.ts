import { CallItem } from '@subsquid/substrate-processor/lib/interfaces/dataSelection'
import { NftRoyalty } from '.'
import { BatchCreatedEventItem, BatchNftMintedEventItem, SingleNftMintedEventItem } from './event'
export { ProxyCallArgs } from '@avn/types'

export type NftMigrationCallItem = CallItem<'Migration.migrate_nfts', { call: { args: true } }>
export type BatchNftMigrationCallItem = CallItem<
  'Migration.migrate_nft_batches',
  { call: { args: true } }
>

export type SingleNftMintedEventCallItem = Required<SingleNftMintedEventItem['event']>['call']
export type BatchNftMintedEventCallItem = Required<BatchNftMintedEventItem['event']>['call']
export type BatchCreatedEventCallItem = Required<BatchCreatedEventItem['event']>['call']

// NOTE: call args require manual typing
export type NftCallKind = 'signed_mint_single_nft' | 'signed_mint_batch_nft' | 'signed_create_batch'

export interface SingleNftMintedCallArgs {
  // __kind: 'signed_mint_single_nft' for proxy
  royalties: NftRoyalty[]
  t1Authority: string
  uniqueExternalRef: string
}

export interface BatchNftMintedCallArgs {
  // __kind: 'signed_mint_batch_nft' for proxy
  index: number
  owner: string
  batchId: string
  uniqueExternalRef: string
}

export interface BatchCreatedCallArgs {
  // __kind: 'signed_create_batch' for proxy
  royalties: NftRoyalty[]
  t1Authority: string
  totalSupply: number
}
