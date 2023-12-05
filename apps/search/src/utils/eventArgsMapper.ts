/**
 * Maps data value to a string keyword for ES search
 * @param {*} val data value to map into a string keyword
 * @returns {string | null | string[] | string[][]} string, null or array of strings (any depth)
 */
function argsToKeywordMapper(
  val: string | object | number | null
): string | null | string[] | string[][] {
  if (val === null) return null
  switch (typeof val) {
    case 'string':
      return val
    // array, to flatten it later
    case 'object':
      // @ts-expect-error not sure why TS complains here
      return Object.values(val).map((vv: any) => argsToKeywordMapper(vv))
    // e.g. number "123"
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
  if (Array.isArray(data)) return data.flat()
  return [data]
}
