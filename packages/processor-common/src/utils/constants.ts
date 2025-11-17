export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  BASE_DELAY_MS: 1000,
  MAX_DELAY_MS: 10000
} as const

export const CONCURRENCY_CONFIG = {
  BLOCK_PROCESSING: 5000, // Process 5 blocks in parallel
  EVENT_PROCESSING: 10000, // Process 10 events in parallel
  ITEM_PROCESSING: 20000 // Process 20 items in parallel
} as const
