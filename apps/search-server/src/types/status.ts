import { config } from '../config'

interface AppStatusConfig {
  logging: typeof config.logging
  db: {
    baseUrl: typeof config.db.baseUrl
    blocksIndex: typeof config.db.blocksIndex
    extrinsicsIndex: typeof config.db.extrinsicsIndex
  }
  server: {
    port: typeof config.server.port
    corsAllowedUrls: typeof config.server.corsAllowedUrls
    statusPort: typeof config.server.statusPort
  }
}

export interface AppStatus {
  status: 'ok'
  config: AppStatusConfig
  version: string
  buildTimestamp: string
}
