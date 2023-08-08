import {
  SingleNftMintedCallArgs,
  ProxyCallArgs,
  SingleNftMintedEventCallItem,
  BatchNftMintedEventCallItem,
  BatchNftMintedCallArgs,
  BatchCreatedCallArgs,
  BatchCreatedEventCallItem
} from './types'

export const handleSignedMintSingleNft = (
  callItem: SingleNftMintedEventCallItem
): SingleNftMintedCallArgs => {
  const { args } = callItem
  if (!callItem.name.includes('proxy')) {
    return args
  }

  const proxyArgs = args as ProxyCallArgs<SingleNftMintedCallArgs>
  const { royalties, t1Authority, uniqueExternalRef } = proxyArgs.call.value
  return {
    royalties,
    t1Authority,
    uniqueExternalRef
  }
}

export const handleSignedMintBatchNft = (
  callItem: BatchNftMintedEventCallItem
): BatchNftMintedCallArgs => {
  const { args } = callItem
  if (!callItem.name.includes('proxy')) {
    return args
  }

  const proxyArgs = args as ProxyCallArgs<BatchNftMintedCallArgs>
  const { owner, batchId, uniqueExternalRef, index } = proxyArgs.call.value
  return {
    index,
    owner,
    batchId,
    uniqueExternalRef
  }
}

export const handleSignedCreateBatchNft = (
  callItem: BatchCreatedEventCallItem
): BatchCreatedCallArgs => {
  const { args } = callItem
  if (!callItem.name.includes('proxy')) {
    return args
  }

  const proxyArgs = args as ProxyCallArgs<BatchCreatedCallArgs>
  const { royalties, t1Authority, totalSupply } = proxyArgs.call.value
  return {
    royalties,
    t1Authority,
    totalSupply
  }
}
