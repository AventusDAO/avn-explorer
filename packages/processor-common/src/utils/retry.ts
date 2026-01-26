export interface RetryContext {
  log?: any
  blockHeight?: number
}

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
  context?: RetryContext
): Promise<T> {
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      if (attempt < maxRetries) {
        const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), 10000) // Max 10s delay
        if (context?.log) {
          context.log.warn(`Retry ${attempt}/${maxRetries} after ${delay}ms`, {
            blockHeight: context.blockHeight,
            error: lastError.message
          })
        }
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  if (context?.log) {
    context.log.error(`Failed after ${maxRetries} retries`, {
      blockHeight: context.blockHeight,
      error: lastError?.message,
      stack: lastError?.stack
    })
  }
  throw lastError || new Error('Unknown error in retry')
}
