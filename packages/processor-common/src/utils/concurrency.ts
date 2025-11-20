export interface ConcurrencyOptions {
  concurrency?: number
  onError?: (error: Error, item: any) => void
}

export async function processInParallelOrdered<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  options: ConcurrencyOptions = {}
): Promise<(R | null)[]> {
  const { concurrency = 5, onError } = options
  const results: (R | null)[] = []

  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency)
    const batchPromises = batch.map(async item => {
      try {
        return await processor(item)
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error))
        if (onError) {
          onError(err, item)
        }
        return null
      }
    })

    const batchResults = await Promise.all(batchPromises)
    results.push(...batchResults)
  }

  return results
}

export async function processInParallel<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  options: ConcurrencyOptions = {}
): Promise<R[]> {
  const results = await processInParallelOrdered(items, processor, options)
  return results.filter((result): result is R => result !== null)
}

export function getDefaultConcurrency(): number {
  const envConcurrency = process.env.PROCESSOR_PROCESSING_CONCURRENCY
  if (envConcurrency) {
    const parsed = parseInt(envConcurrency, 10)
    if (!isNaN(parsed) && parsed > 0) {
      return parsed
    }
  }

  return 5
}
