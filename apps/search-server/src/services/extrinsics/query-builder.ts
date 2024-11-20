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
    fields: [
      'from',
      'to',
      'proxyRecipient',
      'signer',
      'proxySigner',
      'proxyRelayer',
      'proxyPayer',
      'proxyOwner'
    ]
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

const extrinsicDataQuery = (
  dataQuery: ExtrinsicDataQuery,
  includeProxyName?: boolean
): { mustItems: JsonMap[] } => {
  const mustItems: JsonMap[] = []

  const { section, method, blockHeightFrom, blockHeightTo, timestampStart, timestampEnd } =
    dataQuery

  if (includeProxyName === true) {
    if (section) {
      mustItems.push({
        bool: {
          should: [{ match: { section } }, { match: { proxyCallSection: section } }]
        }
      })
    }
    if (method) {
      mustItems.push({
        bool: {
          should: [{ match: { method } }, { match: { proxyCallMethod: method } }]
        }
      })
    }
  } else {
    if (section) mustItems.push({ match: { section } })
    if (method) mustItems.push({ match: { method } })
  }

  const blockRangeQuery = numberRangeFilterSubQuery('blockHeight', blockHeightFrom, blockHeightTo)
  if (blockRangeQuery) mustItems.push(blockRangeQuery)
  const timestampQuery = timestampRangeFilterSubQuery('timestamp', timestampStart, timestampEnd)
  if (timestampQuery) mustItems.push(timestampQuery)
  return {
    mustItems
  }
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
  dataQuery?: ExtrinsicDataQuery,
  includeProxyName?: boolean
): EsQuery => {
  const mustItems: JsonMap[] = []
  const shouldItems: JsonMap[] = []
  if (dataQuery) {
    const dataQueryRes = extrinsicDataQuery(dataQuery, includeProxyName)
    mustItems.push(...dataQueryRes.mustItems)
  }

  const filters: AnyJson[] = []
  if (isFailed !== undefined) filters.push(isFailedSubQuery(isFailed))
  if (signedOnly) filters.push(signedOnlyQuery())

  return {
    bool: {
      must: mustItems,
      should: shouldItems,
      filter: filters
    }
  }
}
