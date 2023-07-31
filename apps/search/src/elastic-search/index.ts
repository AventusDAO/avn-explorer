import { ElasticSearch, EsOptions } from './elastic-search'

export const getElasticSearch = (): ElasticSearch => {
  const options: EsOptions = {
    baseUrl: process.env.ES_URL ?? 'http://localhost:9200',
    blocksIndex: process.env.ES_BLOCKS_INDEX ?? 'blocks',
    extrinsicsIndex: process.env.ES_EXTRINSICS_INDEX ?? 'extrinsics',
    eventsIndex: process.env.ES_EVENTS_INDEX ?? 'events',
    maxPayloadBytes: process.env.ES_MAX_PAYLOAD_BYTES
      ? parseInt(process.env.ES_MAX_PAYLOAD_BYTES)
      : 8000000
  }
  return new ElasticSearch(options)
}
