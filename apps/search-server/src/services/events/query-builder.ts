import { EsQuery, JsonMap } from '../../types'
import { numberRangeFilterSubQuery, timestampRangeFilterSubQuery } from '../../utils/query-builder'

export interface EventsDataQuery {
  section?: string
  name?: string
  blockHeightFrom?: number
  blockHeightTo?: number
  timestampStart?: number
  timestampEnd?: number
}

const extrinsicDataQuery = (dataQuery: EventsDataQuery): JsonMap[] => {
  const matches: JsonMap[] = []
  const { section, name, blockHeightFrom, blockHeightTo, timestampStart, timestampEnd } = dataQuery
  if (section) matches.push({ match: { section } })
  if (name) matches.push({ match: { name } })
  const blockRangeQuery = numberRangeFilterSubQuery('blockHeight', blockHeightFrom, blockHeightTo)
  if (blockRangeQuery) matches.push(blockRangeQuery)
  const timestampQuery = timestampRangeFilterSubQuery('timestamp', timestampStart, timestampEnd)
  if (timestampQuery) matches.push(timestampQuery)
  return matches
}

/**
 * Gets query for fetching events from ElasticSearch
 * @returns {EsQuery} query object for ElasticSearch
 */
export const getEventsQuery = (dataQuery: EventsDataQuery = {}): EsQuery | undefined => {
  if (!Object.values(dataQuery).length) return undefined

  const mustItems: JsonMap[] = []
  if (dataQuery) mustItems.push(...extrinsicDataQuery(dataQuery))

  return {
    bool: {
      must: mustItems
    }
  }
}
/**
 * Gets ElasticSearch/OpenSearch query for fetching events
 * @returns {EventsDataQuery} query object for ElasticSearch
 */
export const getExtrinsicsQuery = (dataQuery?: EventsDataQuery): EsQuery => {
  const mustItems: JsonMap[] = []
  if (dataQuery) mustItems.push(...extrinsicDataQuery(dataQuery))
  return {
    bool: {
      must: mustItems
    }
  }
}
