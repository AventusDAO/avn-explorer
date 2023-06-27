import { AxiosError } from 'axios'
import { ApiError, avnHashRegex, isAxiosError } from '../../utils'
import {
  EsSortItem,
  EsRequestPayload,
  EsSortDirection,
  EsQuery,
  SearchExtrinsic
} from '../../types'
import { getLogger } from '../../utils/logger'
import { config } from '../../config'
import { processSortParam } from '../../utils/paramHelpers'
import { elasticSearch } from '../elastic-search'
import { decodeAccountToHex, encodeAccountHex } from '../user-service'
import {
  ExtrinsicDataQuery,
  getExtrinsicsQuery,
  getMultiTransactionsForAddressQuery
} from './query-builder'

const logger = getLogger('extrinsics-service')

const supportedSortFields = ['timestamp', 'blockHeight']
const defaultSort: EsSortItem = { timestamp: EsSortDirection.Desc }

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

export const getExtrinsics = async (
  size = 50,
  from = 0,
  sortCsv?: string,
  address?: string,
  isFailed?: boolean,
  systemOnly?: boolean,
  dataQuery?: ExtrinsicDataQuery
): Promise<SearchExtrinsic[]> => {
  let query: EsQuery
  let isHexAddress = false
  let ss58Value: string | undefined
  if (address) {
    // note: user address may be entered as hex decoded `0x...` value or the encoded ss58 representation
    isHexAddress = avnHashRegex.test(address)
    if (isHexAddress) {
      ss58Value = encodeAccountHex(address)
      query = getMultiTransactionsForAddressQuery([ss58Value, address])
    } else {
      const hexValue = decodeAccountToHex(address)
      // we do this here because we know this will generate avn prefixed addresses
      const avnPrefixedSS58Address = encodeAccountHex(hexValue)

      if (avnPrefixedSS58Address === address) {
        query = getMultiTransactionsForAddressQuery([address, hexValue])
      } else {
        // this means we are searching using a non-avn prefixed address, so search with all 3 values.
        query = getMultiTransactionsForAddressQuery([avnPrefixedSS58Address, address, hexValue])
      }
    }
  } else {
    query = getExtrinsicsQuery(undefined, isFailed, systemOnly, dataQuery)
  }

  const sort: EsSortItem[] = []
  if (sortCsv !== undefined) {
    const sortItem = processSortParam(sortCsv, supportedSortFields) // throws ApiError (400) if sort is not supported
    sort.push(sortItem)
  }
  sort.push(defaultSort)

  const payload: EsRequestPayload = { size, from, sort, query }
  try {
    const response = await elasticSearch.post<SearchExtrinsic>(
      `${config.db.extrinsicsIndex}/_search`,
      payload
    )

    let data = response.data.hits.hits.map(hit => hit._source)

    if (isHexAddress && ss58Value && address) {
      // note: replace `ss58Value` with the search value to return to user values that are in the same format he used in search
      const jsonData = JSON.stringify(data)
      data = JSON.parse(jsonData.replaceAll(ss58Value, address))
    }
    return data
  } catch (err) {
    throw processError(err)
  }
}
