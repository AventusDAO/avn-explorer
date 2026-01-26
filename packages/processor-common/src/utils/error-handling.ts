export interface ErrorContext {
  blockHeight?: number
  blockNumber?: number
  [key: string]: any
}

export function formatError(error: unknown, context?: ErrorContext): string {
  const errorMessage = error instanceof Error ? error.message : String(error)
  const errorStack = error instanceof Error ? error.stack : undefined

  if (context) {
    const contextStr = Object.entries(context)
      .map(([key, value]) => `${key}=${value}`)
      .join(', ')
    return `${errorMessage}${contextStr ? ` (${contextStr})` : ''}${
      errorStack ? `\nStack: ${errorStack}` : ''
    }`
  }

  return errorMessage + (errorStack ? `\nStack: ${errorStack}` : '')
}

export function isRetryableError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false
  }

  if (
    error.message.includes('ECONNREFUSED') ||
    error.message.includes('ETIMEDOUT') ||
    error.message.includes('ENOTFOUND')
  ) {
    return true
  }

  if (error.message.includes('connection') || error.message.includes('timeout')) {
    return true
  }

  if (error.message.includes('rate limit') || error.message.includes('429')) {
    return true
  }

  return false
}
