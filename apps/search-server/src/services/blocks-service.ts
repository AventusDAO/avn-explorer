import { AxiosError } from 'axios'
import { ApiError, isAxiosError } from '../utils'
import {
  JsonMap,
  EsSortItem,
  EsRequestPayload,
  EsSortDirection,
  EsQuery,
  SearchBlock
} from '../types'
import { getLogger } from '../utils/logger'
import { config } from '../config'
import { processSortParam } from '../utils/paramHelpers'
import { elasticSearch } from './elastic-search'
const logger = getLogger('blocks-controller')

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const processError = (err: any): Error => {
  if (isAxiosError(err)) {
    const axiosError = err as AxiosError
    logger.error(
      `Failed to fetch data from ElasticSearch.\n${JSON.stringify(axiosError.response?.data)}`
    )
    // database (ES) rejected our request, even code could be 400, to external client should be 500
    return ApiError.fromAxios(axiosError, 500, 'Internal Server Error')
  }
  return err
}

interface SearchBlocksQuery extends EsQuery {
  bool: {
    must?: JsonMap[]
    must_not?: JsonMap[]
    should?: JsonMap | JsonMap[]
  }
}

/**
 * Gets query for fetching blocks within given timestamp range
 * @param {number} minTimestamp optional min timestamp of the block
 * @param {boolean} signedOnly whether to return only blocks that contain at least one signed extrinsic
 * @returns {EsQuery} query object for ElasticSearch
 */
const getBlocksQuery = (minTimestamp?: number, signedOnly?: boolean): EsQuery => {
  const query: SearchBlocksQuery = {
    bool: {
      must: []
    }
  }
  if (minTimestamp !== undefined) {
    query.bool.must?.push({
      range: { timestamp: { gte: minTimestamp } }
    })
  }
  if (signedOnly) {
    query.bool.must?.push({
      range: { noSignedTransactions: { gte: 1 } }
    })
  }

  return query
}

export const getBlocks = async (
  size = 50,
  from = 0,
  signedOnly = false,
  sortCsv?: string
): Promise<SearchBlock[]> => {
  const query = getBlocksQuery(undefined, signedOnly)
  const sort: EsSortItem[] = []

  const defaultSort: EsSortItem = { height: EsSortDirection.Desc }

  if (sortCsv !== undefined) {
    // throws ApiError (400) if `sort` is not supported
    const supportedSortFields = ['timestamp', 'height']
    const sortItem = processSortParam(sortCsv, supportedSortFields)

    if (sortItem.height) {
      // if sorting by blockHeight.Asc then also sort by chainType .Asc here
      const chainTypeSortDirection: EsSortDirection = sortItem.height
      const chainTypeSort = processSortParam(`chainGen_${chainTypeSortDirection}`, ['chainGen'])
      sort.push(chainTypeSort)
    }

    sort.push(sortItem)
    if (!Object.keys(sortItem).includes('height')) {
      sort.push(defaultSort)
    }
  } else {
    sort.push(defaultSort)
  }

  const payload: EsRequestPayload = { size, from, sort, query }
  try {
    const { data } = await elasticSearch.post<SearchBlock>(
      `${config.db.blocksIndex}/_search`,
      payload
    )
    return data.hits.hits.map(hit => hit._source)
  } catch (err) {
    throw processError(err)
  }
}
