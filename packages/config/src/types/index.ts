export enum NetworkPrefix {
  aventus = 65,
  substrate = 42
}

export interface AvnEnvironement {
  name: string
  endpoint: string
  prefix: NetworkPrefix
  /** name of the types bundle file (if they're needed) */
  typesBundle?: string
}

interface DataSource {
  /**
   * Subsquid substrate archive endpoint URL
   */
  archive: string
  /**
   * Chain node RPC websocket URL
   */
  chain?: string
}

export interface ProcessorConfig {
  prefix: NetworkPrefix
  dataSource: DataSource
  /**
   * name of a JSON file of the types bundle
   */
  typesBundle?: string
  batchSize?: number
  prometheusPort?: string | number
  blockRange?: {
    /**
     * Start of segment (inclusive)
     */
    from: number
    /**
     * End of segment (inclusive). Defaults to infinity.
     */
    to?: number
  }
}
