import { CallItem } from '@subsquid/substrate-processor/lib/interfaces/dataSelection'
import { NftRoyalty } from '../../model'
import { NftMintEventItem } from './event'
export { ProxyCallArgs } from '@avn/types'

export type MintCallItem = CallItem<'NftManager.SingleNftMinted', { call: { args: true } }>
export type NftMintEventCall = Required<NftMintEventItem['event']>['call']

export interface NftMintCallArgs {
  royalties: NftRoyalty[]
  t1Authority: string
  uniqueExternalRef: string
}
