import { EsSortDirection, EsSortItem } from '../types'
import { ApiError } from './errors'
import QueryString from 'qs'

/**
 * Processes sort parameter for Elastic Search request payload
 * @param sortCsv API parameter to process
 * @param supportedSortFields possible sort fields to sort by
 * @returns {EsSortItem} sort query for ElasticSearch
 */
export function processSortParam(
  sortCsv: string,
  supportedSortFields: string[]
): Record<string, EsSortDirection> {
  const splits = sortCsv.split('_')
  if (splits.length !== 2) throw new ApiError('bad_request', 400, 'corrupted sort param', true)
  const [field, direction] = splits
  if (!supportedSortFields.includes(field))
    throw new ApiError('bad_request', 400, 'not supported sort field', true)
  if (direction !== EsSortDirection.Asc && direction !== EsSortDirection.Desc)
    throw new ApiError('bad_request', 400, 'wrong sort direction param', true)
  const sortItem: EsSortItem = {}
  sortItem[field] = direction
  return sortItem
}

export type QueryParam =
  | string
  | QueryString.ParsedQs
  | string[]
  | QueryString.ParsedQs[]
  | undefined

/**
 * Asserts that if the parameter is defined it an integer. Throws ApiError (400) otherwise
 * @param param query parameter
 * @param name name of the query parameter
 * @returns integer (or undefined if it wasn't defined)
 */
export function processIntegerParam(param: QueryParam, name: string): number | undefined {
  let paramInt: number | undefined
  if (param !== undefined) {
    if (typeof param !== 'string')
      throw new ApiError('bad_request', 400, `expected "${name}" to be integer`, true)
    paramInt = parseInt(param)
    if (isNaN(paramInt))
      throw new ApiError('bad_request', 400, `expected "${name}" to be integer`, true)
  }
  return paramInt
}

/**
 * Asserts that if the parameter is defined it is a string. Throws ApiError (400) otherwise
 * @param param query parameter
 * @param name name of the query parameter
 * @returns string (or undefined if it doesn't exist)
 */
export function processStringParam(param: QueryParam, name: string): string | undefined {
  if (param !== undefined && typeof param !== 'string')
    throw new ApiError('bad_request', 400, `expected ${name} to be a string`, true)
  return param as unknown as string
}

/**
 * Asserts required string parameter. Throws ApiError (400) otherwise
 * @param param query parameter
 * @param name name of the query parameter
 * @returns string
 */
export function requireStringParam(param: QueryParam, name: string): string {
  const processed = processStringParam(param, name)
  if (processed === undefined) {
    throw new ApiError('bad_request', 400, `missing required '${name}' parameter`, true)
  }
  return processed
}

/**
 * Asserts that if the parameter is defined it is a boolean. Throws ApiError (400) otherwise
 * @param param query parameter
 * @param name name of the query parameter
 * @returns string (or undefined if it doesn't exist)
 */
export function processBooleanParam(param: QueryParam, name: string): boolean | undefined {
  if (param !== undefined && typeof param !== 'string')
    throw new ApiError('bad_request', 400, `expected ${name} to be a boolean`, true)
  return param === 'true' || param === '1'
}

/**
 * Asserts that if the parameter is defined as an array. Throws ApiError (400) otherwise.
 * Note: this function does not check the type of the array elements.
 * @param param query parameter
 * @param name name of the query parameter
 * @returns array (or undefined if it doesn't exist)
 */
export function processArrayParam<T = string>(param: QueryParam, name: string): T[] | undefined {
  if (param === undefined) return undefined
  if (Array.isArray(param)) return param as unknown as T[]

  if (typeof param === 'object') {
    throw new ApiError(
      'bad_request',
      400,
      `Expected ${name} to be an array query type. Valid examples: '?${name}=val1', '?${name}=val1&${name}=val2', or '?${name}=val1,val2'.`,
      true
    )
  }

  if (param.includes(',')) {
    return param.split(',') as unknown as T[]
  } else {
    // single value
    return [param] as unknown as T[]
  }
}

/**
 * Asserts required array parameter. Throws ApiError (400) otherwise
 * @param param query parameter
 * @param name name of the query parameter
 * @returns Array<T>
 */
export function requireArrayParam<T>(param: QueryParam, name: string): T[] {
  const processed = processArrayParam<T>(param, name)
  if (processed === undefined) {
    throw new ApiError('bad_request', 400, `missing required '${name}' parameter`, true)
  }
  return processed
}
