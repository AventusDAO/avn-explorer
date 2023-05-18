const isProduction = process.env.NODE_ENV === 'production'

export const config = {
  logging: {
    level: process.env.LOG_LEVEL ?? 'info',
    useColor: JSON.parse(process.env.LOG_USE_COLOR ?? 'true'),
    morganRequestsFormat: isProduction ? 'combined' : 'dev'
  },

  /**
   * configuration for the storage of data
   */
  db: {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    baseUrl: process.env.DB_URL!,
    blocksIndex: process.env.DB_BLOCKS_INDEX ?? 'blocks',
    extrinsicsIndex: process.env.DB_EXTRINSICS_INDEX ?? 'extrinsics',
    eventsIndex: process.env.DB_EVENTS_INDEX ?? 'events'
  },

  server: {
    port: process.env.PORT ?? process.env.PORT ?? 3000,
    // for dev set http://localhost:3000 (or whatever UI is using it)
    // for prod set the url of the hosted website
    // can be multi origins separated by a single comma e.g. https://explorer.aventus.io,https://explorer.dev.aventus.io
    corsAllowedUrls: process.env.CORS_ALLOWED_URLS,
    statusPort: process.env.STATUS_PORT ?? 3001
  }
}
