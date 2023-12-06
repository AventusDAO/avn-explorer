/**
 * This list defines the which sections will have their event.args searchable
 */
export const argsSearchableSections = Object.freeze([
  'Balances',
  'AvnProxy',
  'EthereumTransactions',
  'EthereumEvents',
  'NftManager',
  'TokenManager',
  'TransactionPayment'
])

export type RecursiveArray<T> = Array<RecursiveArray<T> | T>

/**
 * Maps data value to a string keyword for ES search
 * @param {*} val data value to map into a string keyword
 * @returns {string | null | string[] | string[][]} string, null or array of strings (any depth)
 */
function argsToKeywordMapper(
  val: string | object | number | null
): string | RecursiveArray<string> | null {
  if (val === null) return null
  switch (typeof val) {
    case 'string':
      return val
    case 'object': {
      const mappedVals = Object.values(val).map((vv: any) => argsToKeywordMapper(vv))
      return mappedVals.filter(v => v !== null).map(v => v as string | RecursiveArray<string>)
    }
    default:
      return String(val)
  }
}

/** Unifies the structure recursively into Array<string> */
export const normalizeEventArgValues = (
  args?: string | number | object | null
): string[] | undefined => {
  if (!args) return undefined
  if (typeof args === 'string') return [args]
  if (typeof args === 'number') return [String(args)]

  const data = argsToKeywordMapper(args)
  if (!data) return undefined
  if (Array.isArray(data)) {
    // @ts-expect-error we know the depth of the array is not infinite, because event args is not infinite
    return data.flat(Infinity)
  }
  return [data]
}
