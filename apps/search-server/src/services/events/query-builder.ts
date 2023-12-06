import { EsQuery, JsonMap } from '../../types'
import {
  getMultiSearchQuery,
  numberRangeFilterSubQuery,
  timestampRangeFilterSubQuery
} from '../../utils/query-builder'

export interface EventsDataQuery {
  section?: string
  name?: string
  blockHeightFrom?: number
  blockHeightTo?: number
  timestampStart?: number
  timestampEnd?: number
  argsSearch?: string[]
}

const eventsDataQuery = (dataQuery: EventsDataQuery): JsonMap[] => {
  const matches: JsonMap[] = []
  const {
    section,
    name,
    blockHeightFrom,
    blockHeightTo,
    timestampStart,
    timestampEnd,
    argsSearch
  } = dataQuery

  if (section) matches.push({ match: { section } })
  if (name) matches.push({ match: { name } })

  const blockRangeQuery = numberRangeFilterSubQuery('blockHeight', blockHeightFrom, blockHeightTo)
  if (blockRangeQuery) matches.push(blockRangeQuery)

  const timestampQuery = timestampRangeFilterSubQuery('timestamp', timestampStart, timestampEnd)
  if (timestampQuery) matches.push(timestampQuery)

  if (argsSearch && argsSearch.length > 0) matches.push(getEventArgsMultiSearchQuery(argsSearch))

  return matches
}

/**
 * Gets query for fetching events from ElasticSearch
 * @returns {EsQuery} query object for ElasticSearch
 */
export const getEventsQuery = (dataQuery: EventsDataQuery = {}): EsQuery | undefined => {
  if (!Object.values(dataQuery).length) return undefined

  const mustItems: JsonMap[] = []
  if (dataQuery) mustItems.push(...eventsDataQuery(dataQuery))

  return {
    bool: {
      must: mustItems
    }
  }
}

export const getEventArgsMultiSearchQuery = (argsSearch: string[]): EsQuery =>
  getMultiSearchQuery(argsSearch, ['__argValues'], 'must')