export interface IndexMapping {
  mappings: {
    properties: Record<string, any>
  }
}

export interface MappingsResponse {
  [index: string]: IndexMapping
}

export type BulkAction = string
export type BulkItem = string
export type BulkItemActionChunk = [BulkAction, BulkItem]
