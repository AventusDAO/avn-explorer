export interface IndexMapping {
  mappings: {
    properties: Record<string, any>
  }
}

export interface MappingsResponse {
  [index: string]: IndexMapping
}