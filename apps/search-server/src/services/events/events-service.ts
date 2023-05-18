import { AxiosError } from 'axios'
import { ApiError, isAxiosError } from '../../utils'
import { EsSortItem, EsRequestPayload, EsSortDirection, EsQuery, SearchEvent } from '../../types'
import { getLogger } from '../../utils/logger'
import { config } from '../../config'
import { processSortParam } from '../../utils/paramHelpers'
import { elasticSearch } from '../elastic-search'
import { EventsDataQuery, getEventsQuery } from './query-builder'

const logger = getLogger('events-service')

const supportedSortFields = ['timestamp', 'blockHeight']
const defaultSort: EsSortItem = { timestamp: EsSortDirection.Desc }

export const getEvents = async (
  size = 50,
  from = 0,
  sortCsv?: string,
  dataQuery?: EventsDataQuery
): Promise<SearchEvent[]> => {
  const query = getEventsQuery(dataQuery)
  const sort: EsSortItem[] = []

  if (sortCsv !== undefined) {
    const sortItem = processSortParam(sortCsv, supportedSortFields) // throws ApiError (400) if sort is not supported
    if (sortItem.blockHeight) {
      // if sorting by blockHeight.Asc then also sort by chainType .Asc here
      const chainTypeSortDirection: EsSortDirection = sortItem.blockHeight
      const chainTypeSort = processSortParam(`chainGen,${chainTypeSortDirection}`, ['chainGen'])
      sort.push(chainTypeSort)
    }
    sort.push(sortItem)
  } else {
    sort.push(defaultSort)
  }

  const payload: EsRequestPayload = { size, from, sort, query }
  try {
    const response = await elasticSearch.post<SearchEvent>(
      `${config.db.eventsIndex}/_search`,
      payload
    )

    return response.data.hits.hits.map(hit => hit._source)
  } catch (err) {
    if (isAxiosError(err)) {
      const axiosError = err as AxiosError
      logger.error(
        `Failed to fetch data from ElasticSearch.\n${JSON.stringify(axiosError.response?.data)}`
      )
      // database (ES) rejected our request, even code could be 400, to external client should be 500
      throw ApiError.fromAxios(axiosError, 500, 'Internal Server Error')
    } else {
      throw err
    }
  }
}
