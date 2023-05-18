import { blocksSchema, extrinsicsSchema, eventsSchema } from './schema'
import { SearchBlock, SearchEvent, SearchExtrinsic, IndexMapping, MappingsResponse } from './types'
import { get, post, put } from './utils'

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
  eventsIndex: string
  constructor({ baseUrl, blocksIndex, extrinsicsIndex, eventsIndex }: EsOptions) {
    this.baseUrl = baseUrl
    this.blocksIndex = blocksIndex
    this.extrinsicsIndex = extrinsicsIndex
    this.eventsIndex = eventsIndex
  }

  /**
   * Creates indexes and sets their mappings *explicitly* based on json files.
   * This function will throw if called and indexes are already created.
   *
   * NOTE: there's no way to re-do mapping once indexes.
   * If mappings require to be changed one needs to drop and index and create a new one
   */
  async setupIndexes(): Promise<void> {
    const responses = await Promise.all([
      put<any>(`${this.baseUrl}/${this.blocksIndex}`, blocksSchema),
      put<any>(`${this.baseUrl}/${this.extrinsicsIndex}`, extrinsicsSchema),
      put<any>(`${this.baseUrl}/${this.eventsIndex}`, eventsSchema)
    ])
    const errorResponses = responses.filter(res => res.error !== undefined || res.status >= 400)
    if (errorResponses.length > 0) {
      throw new Error(
        `Could not create ElasticSearch index mappings. \nErrors: ${JSON.stringify(
          errorResponses.map(res => res)
        )}`
      )
    }
  }

  /**
   * Check if ElasticSearch has set up indexes.
   * WARNING: it does not check whether the mappings are up to date
   * @returns {Promise<boolean>} whether the blocks and extrinsics indexes have been created
   */
  async isSetUp(): Promise<boolean> {
    const url = `${this.baseUrl}/_mappings`
    const res: MappingsResponse = await get(url)
    const blocks = res[this.blocksIndex]
    const extrinsics = res[this.extrinsicsIndex]
    const events = res[this.eventsIndex]

    const isIndexSetup = (indexResponse: IndexMapping): boolean =>
      indexResponse?.mappings !== undefined

    const isElasticSearchSetup =
      isIndexSetup(blocks) && isIndexSetup(extrinsics) && isIndexSetup(events)

    return isElasticSearchSetup
  }

  /**
   * Store a batches of blocks, extrinsics and events in ElasticSearch
   */
  async storeBatch(
    blocks: SearchBlock[],
    extrinsics: SearchExtrinsic[],
    events: SearchEvent[]
  ): Promise<void> {
    await Promise.all([
      this.storeBulk(blocks, this.blocksIndex, '_doc', 'refId'),
      this.storeBulk(extrinsics, this.extrinsicsIndex, '_doc', 'refId'),
      this.storeBulk(events, this.eventsIndex, '_doc', 'refId')
    ])
  }

  /**
   * Execute bulk upload of objects to ElasticSearch
   * @param {*} objects - array of objects
   *
   * @returns {Promise<ElasticSearchBulkResult>} Promise of the ES bulk operation
   */
  async storeBulk(
    objects: any[],
    indexName: string,
    objectType = '_doc',
    idAccessor = 'refId'
  ): Promise<void> {
    const url = `${this.baseUrl}/_bulk`
    const payload = this.getBulkPayload(objects, indexName, objectType, idAccessor)
    await post<any>(url, payload, 'application/x-ndjson')
  }

  /**
   * Processes objects into ElasticSearch bulk format
   * @param {*} objects - Objects to store. Must have `refId` property that will be treated as _id
   * @param {string} indexName - Name of the ES index to store to
   * @param {string} type - Name of the object type in ES
   * @param {string} idAccessor - Name of the object's property to use as the _id in ES
   */
  getBulkPayload(objects: any[], indexName: string, type = '_doc', idAccessor: string): string {
    function getAction(indexName: string, type: string, id: string): string {
      return `{"index":{"_index":"${indexName}","_type":"${type}","_id":"${id}"}}`
    }
    return objects.reduce((prev, curr) => {
      return (
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        prev + getAction(indexName, type, curr[idAccessor]) + '\n' + JSON.stringify(curr) + '\n'
      )
    }, '')
  }
}
