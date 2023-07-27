import { AnyJson, EsQuery, JsonMap } from '../../types'
import { numberRangeFilterSubQuery, timestampRangeFilterSubQuery } from '../../utils/query-builder'

export interface ExtrinsicDataQuery {
  section?: string
  method?: string
  blockHeightFrom?: number
  blockHeightTo?: number
  timestampStart?: number
  timestampEnd?: number
}

/**
 * Gets query for searching across ES for given address
 * @param {string} value the address to search for
 * @returns {EsQuery} query object for ElasticSearch
 */
const getTransactionsForAddressQuery = (value: string): EsQuery => ({
  multi_match: {
    query: value,
    fields: ['proxy.signer', 'proxy.relayer']
  }
})

/**
 * Gets query for searching for multiple values at the same time
 * @param {string} values values to search for
 * @returns {EsQuery} query object for ElasticSearch
 */
export const getMultiTransactionsForAddressQuery = (values: string[]): EsQuery => ({
  bool: {
    should: values.map(value => getTransactionsForAddressQuery(value))
  }
})

const isFailedSubQuery = (isFailed: boolean): EsQuery => ({
  match: { isSuccess: !isFailed }
})

const signedOnlyQuery = (): EsQuery => ({
  match: { isSigned: true }
})

const extrinsicDataQuery = (dataQuery: ExtrinsicDataQuery): JsonMap[] => {
  const matches: JsonMap[] = []
  const { section, method, blockHeightFrom, blockHeightTo, timestampStart, timestampEnd } =
    dataQuery
  if (section) matches.push({ match: { section } })
  if (method) matches.push({ match: { method } })
  const blockRangeQuery = numberRangeFilterSubQuery('blockHeight', blockHeightFrom, blockHeightTo)
  if (blockRangeQuery) matches.push(blockRangeQuery)
  const timestampQuery = timestampRangeFilterSubQuery('timestamp', timestampStart, timestampEnd)
  if (timestampQuery) matches.push(timestampQuery)
  return matches
}

/**
 * Gets ElasticSearch/OpenSearch query for fetching extrinsics
 * @param {boolean} isFailed optional whether to query failed extrinsic
 * @param {boolean} signedOnly optional whether to query signed only extrinsics
 * @returns {ExtrinsicDataQuery} query object for ElasticSearch
 */
export const getExtrinsicsQuery = (
  isFailed?: boolean,
  signedOnly?: boolean,
  dataQuery?: ExtrinsicDataQuery
): EsQuery => {
  const mustItems: JsonMap[] = []
  if (dataQuery) mustItems.push(...extrinsicDataQuery(dataQuery))

  const filters: AnyJson[] = []
  if (isFailed !== undefined) filters.push(isFailedSubQuery(isFailed))
  if (signedOnly) filters.push(signedOnlyQuery())
  return {
    bool: {
      must: mustItems,
      filter: filters
    }
  }
}
