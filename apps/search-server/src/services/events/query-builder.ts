import { AnyJson, EsQuery } from '../../types'

export interface EventsDataQuery {}

/**
 * Gets query for fetching events from ElasticSearch
 * @returns {EsQuery} query object for ElasticSearch
 */
export const getEventsQuery = (dataQuery: EventsDataQuery = {}): EsQuery => {
  if (!Object.values(dataQuery).length) return {}
  const filters: AnyJson[] = []
  return {
    bool: {
      filter: filters
    }
  }
}
