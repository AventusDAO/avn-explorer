export interface EsOptions {
  baseUrl: string
  blocksIndex: string
  extrinsicsIndex: string
  eventsIndex: string
}

export class ElasticSearch {
  baseUrl: string
  blocksIndex: string
  extrinsicsIndex: string
  constructor({ baseUrl, blocksIndex, extrinsicsIndex }: EsOptions) {
    this.baseUrl = baseUrl
    this.blocksIndex = blocksIndex
    this.extrinsicsIndex = extrinsicsIndex
  }
}
