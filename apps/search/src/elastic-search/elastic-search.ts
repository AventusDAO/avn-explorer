import { blocksSchema, extrinsicsSchema, eventsSchema } from './schema'
import {
  SearchBlock,
  SearchEvent,
  SearchExtrinsic,
  IndexMapping,
  MappingsResponse,
  BulkAction,
  BulkItemActionChunk
} from './types'
import { get, post, put } from './utils'

export interface EsOptions {
  baseUrl: string
  blocksIndex: string
  extrinsicsIndex: string
  eventsIndex: string
  maxPayloadBytes: number
}

export class ElasticSearch {
  baseUrl: string
  blocksIndex: string
  extrinsicsIndex: string
  eventsIndex: string
  maxPayloadBytes: number

  constructor({ baseUrl, blocksIndex, extrinsicsIndex, eventsIndex, maxPayloadBytes }: EsOptions) {
    this.baseUrl = baseUrl
    this.blocksIndex = blocksIndex
    this.extrinsicsIndex = extrinsicsIndex
    this.eventsIndex = eventsIndex
    this.maxPayloadBytes = maxPayloadBytes
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
      this.storeBulk(blocks, this.blocksIndex, 'refId'),
      this.storeBulk(extrinsics, this.extrinsicsIndex, 'refId'),
      this.storeBulk(events, this.eventsIndex, 'refId')
    ])
  }

  /**
   * Execute bulk upload of objects to ElasticSearch
   * @param {*} objects - array of objects
   *
   * @returns {Promise<ElasticSearchBulkResult>} Promise of the ES bulk operation
   */
  async storeBulk(objects: any[], indexName: string, idAccessor = 'refId'): Promise<void> {
    const url = `${this.baseUrl}/_bulk`
    const payloadChunks = this.getBulkPayloads(objects, indexName, idAccessor)
    const splitPayloadChunks = this.splitPayloadToChunks(payloadChunks, this.maxPayloadBytes)
    for (const payloadChunk of splitPayloadChunks) {
      const payloadActions = payloadChunk.map(chunk => chunk.join('\n')).join('\n') + '\n'
      await post<any>(url, payloadActions, 'application/x-ndjson')
    }
  }

  /** Splits payload into chunks that fit into the specified size limit */
  splitPayloadToChunks(
    payload: BulkItemActionChunk[],
    maxPayloadBytes: number
  ): BulkItemActionChunk[][] {
    const payloadStr = payload.map(([action, obj]) => `${action}\n${obj}`).join('\n')
    const payloadSize = Buffer.byteLength(payloadStr, 'utf8')

    if (payloadSize < this.maxPayloadBytes) {
      return [payload]
    }

    const halfIdx = Math.ceil(payload.length / 2)
    const firstHalfChunks = this.splitPayloadToChunks(payload.slice(0, halfIdx), maxPayloadBytes)
    const secondHalfChunks = this.splitPayloadToChunks(payload.slice(halfIdx), maxPayloadBytes)

    return [...firstHalfChunks, ...secondHalfChunks]
  }

  /**
   * Processes objects into ElasticSearch bulk format
   * @param {*} objects - Objects to store. Must have `refId` property that will be treated as _id
   * @param {string} indexName - Name of the ES index to store to
   * @param {string} type - Name of the object type in ES
   * @param {string} idAccessor - Name of the object's property to use as the _id in ES
   */
  getBulkPayloads(objects: any[], indexName: string, idAccessor: string): BulkItemActionChunk[] {
    const getBulkAction = (indexName: string, id: string): BulkAction =>
      JSON.stringify({
        index: {
          _index: indexName,
          _id: id
        }
      })

    return objects.map(item => {
      return [getBulkAction(indexName, item[idAccessor]), JSON.stringify(item)]
    })
  }
}
