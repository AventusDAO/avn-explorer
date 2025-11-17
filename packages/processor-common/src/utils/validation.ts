export function validateSS58Address(address: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]{47,48}$/.test(address)
}

export function validateBigIntString(value: string, fieldName: string): void {
  if (!/^\d+$/.test(value)) {
    throw new Error(`Invalid ${fieldName}: must be a non-negative integer string`)
  }
  try {
    const bigIntValue = BigInt(value)
    if (bigIntValue < 0n) {
      throw new Error(`Invalid ${fieldName}: must be non-negative`)
    }
  } catch (error) {
    throw new Error(
      `Invalid ${fieldName}: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}

export function validatePrometheusTags(tags: string): void {
  const tagPattern = /^[a-z_][a-z0-9_]*=[a-z0-9_]+(,[a-z_][a-z0-9_]*=[a-z0-9_]+)*$/i
  if (!tagPattern.test(tags)) {
    throw new Error(
      `Invalid prometheusTags format: must be 'key=value,key2=value2' (alphanumeric and underscore only)`
    )
  }
}

export function validateEventName(eventName: string): void {
  if (!/^[A-Za-z][A-Za-z0-9_]*\.[A-Za-z][A-Za-z0-9_]*$/.test(eventName)) {
    throw new Error(
      `Invalid eventName format: must be 'Section.Method' (e.g., 'Balances.Transfer')`
    )
  }
}
