export interface NftRoyalty {
  rate: {
    partsPerMillion: number
  }
  recipientT1Address: string
}

interface _NftMetadata {
  id: string
  mintBlock: number
  mintDate: Date
  owner: string
  uniqueExternalRef: string
  t1Authority: string
}

export interface SingleNftMetadata extends _NftMetadata {
  royalties: NftRoyalty[]
}

export interface BatchNftMetadata extends _NftMetadata {
  batchId: string
  index: number
}

export type NftMetadata = SingleNftMetadata | BatchNftMetadata

// todo:
export interface BatchMetadata {}
