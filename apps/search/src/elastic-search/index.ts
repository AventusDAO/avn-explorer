import { ElasticSearch, EsOptions } from './elastic-search'

export const getElasticSearchClient = async (): Promise<ElasticSearch> => {
  const options: EsOptions = {
    baseUrl: process.env.ES_URL ?? 'http://localhost:9200',
    blocksIndex: process.env.ES_BLOCKS_INDEX ?? 'blocks',
    extrinsicsIndex: process.env.ES_EXTRINSICS_INDEX ?? 'extrinsics',
    eventsIndex: process.env.ES_EVENTS_INDEX ?? 'events'
  }
  const client = new ElasticSearch(options)
  const isSetUp = await client.isSetUp()
  if (!isSetUp) {
    await client.setupIndexes()
  }
  return client
}
