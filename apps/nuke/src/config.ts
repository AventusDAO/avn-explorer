export interface DatabaseConfig {
  name:
    | 'archive'
    | 'errors'
    | 'fees'
    | 'balances'
    | 'staking'
    | 'balances'
    | 'summary'
    | 'tokens'
    | 'solochain-search'
    | 'search'
    | 'account-monitor'
    | 'nft'
    | 'node-manager'
    | 'assets'
  reset: boolean
  resetHeight?: number | boolean
  db?: string
  user?: string
  pass?: string
  resetIndexes?: boolean
  esUrl?: string
  esBlocksIndex?: string
  esExtrinsicsIndex?: string
  esEventsIndex?: string
}

/**
 * Parses RESET_HEIGHT environment variable value.
 * - "true" → returns true (reset to block 0)
 * - numeric string → returns the number (reset to specific block)
 * - "false" → returns false (disabled)
 * - unset → returns undefined (disabled)
 */
const parseResetHeight = (value: string | undefined): number | boolean | undefined => {
  if (!value || value === 'false') return undefined
  if (value === 'true') return 0
  const num = parseInt(value, 10)
  if (isNaN(num) || num < 0) {
    throw new Error(
      `Invalid RESET_HEIGHT value: ${value}. Must be "true", "false", or a non-negative number`
    )
  }
  return num
}

export const getDbConfigs: () => Readonly<DatabaseConfig[]> = () =>
  Object.freeze([
    {
      name: 'archive',
      reset: process.env.RESET_ARCHIVE === 'true',
      resetHeight: parseResetHeight(process.env.RESET_HEIGHT_ARCHIVE),
      db: process.env.DB_SCHEMA_ARCHIVE,
      user: process.env.DB_USER_ARCHIVE,
      pass: process.env.DB_PASS_ARCHIVE
    },
    {
      name: 'errors',
      reset: process.env.RESET_ERRORS === 'true',
      resetHeight: parseResetHeight(process.env.RESET_HEIGHT_ERRORS),
      db: process.env.DB_SCHEMA_ERRORS,
      user: process.env.DB_USER_ERRORS,
      pass: process.env.DB_PASS_ERRORS
    },
    {
      name: 'fees',
      reset: process.env.RESET_FEES === 'true',
      resetHeight: parseResetHeight(process.env.RESET_HEIGHT_FEES),
      db: process.env.DB_SCHEMA_FEES,
      user: process.env.DB_USER_FEES,
      pass: process.env.DB_PASS_FEES
    },
    {
      name: 'balances',
      reset: process.env.RESET_BALANCES === 'true',
      resetHeight: parseResetHeight(process.env.RESET_HEIGHT_BALANCES),
      db: process.env.DB_SCHEMA_BALANCES,
      user: process.env.DB_USER_BALANCES,
      pass: process.env.DB_PASS_BALANCES
    },
    {
      name: 'staking',
      reset: process.env.RESET_STAKING === 'true',
      resetHeight: parseResetHeight(process.env.RESET_HEIGHT_STAKING),
      db: process.env.DB_SCHEMA_STAKING,
      user: process.env.DB_USER_STAKING,
      pass: process.env.DB_PASS_STAKING
    },
    {
      name: 'summary',
      reset: process.env.RESET_SUMMARY === 'true',
      resetHeight: parseResetHeight(process.env.RESET_HEIGHT_SUMMARY),
      db: process.env.DB_SCHEMA_SUMMARY,
      user: process.env.DB_USER_SUMMARY,
      pass: process.env.DB_PASS_SUMMARY
    },
    {
      name: 'tokens',
      reset: process.env.RESET_TOKENS === 'true',
      resetHeight: parseResetHeight(process.env.RESET_HEIGHT_TOKENS),
      db: process.env.DB_SCHEMA_TOKENS,
      user: process.env.DB_USER_TOKENS,
      pass: process.env.DB_PASS_TOKENS
    },
    {
      name: 'account-monitor',
      reset: process.env.RESET_ACCOUNT_MONITOR === 'true',
      resetHeight: parseResetHeight(process.env.RESET_HEIGHT_ACCOUNT_MONITOR),
      db: process.env.DB_SCHEMA_ACCOUNT_MONITOR,
      user: process.env.DB_USER_ACCOUNT_MONITOR,
      pass: process.env.DB_PASS_ACCOUNT_MONITOR
    },
    {
      name: 'nft',
      reset: process.env.RESET_NFT === 'true',
      resetHeight: parseResetHeight(process.env.RESET_HEIGHT_NFT),
      db: process.env.DB_SCHEMA_NFT,
      user: process.env.DB_USER_NFT,
      pass: process.env.DB_PASS_NFT
    },
    {
      name: 'search',
      reset: process.env.RESET_SEARCH === 'true',
      resetHeight: parseResetHeight(process.env.RESET_HEIGHT_SEARCH),
      db: process.env.DB_SCHEMA_SEARCH,
      user: process.env.DB_USER_SEARCH,
      pass: process.env.DB_PASS_SEARCH,
      resetIndexes: process.env.RESET_SEARCH_INDEXES === 'true',
      esUrl: process.env.ES_URL_SEARCH,
      esBlocksIndex: process.env.ES_BLOCKS_INDEX_SEARCH,
      esExtrinsicsIndex: process.env.ES_EXTRINSICS_INDEX_SEARCH,
      esEventsIndex: process.env.ES_EVENTS_INDEX_SEARCH
    },
    {
      name: 'solochain-search',
      reset: process.env.RESET_SOLOCHAIN_SEARCH === 'true',
      resetHeight: parseResetHeight(process.env.RESET_HEIGHT_SOLOCHAIN_SEARCH),
      db: process.env.DB_SCHEMA_SOLOCHAIN_SEARCH,
      user: process.env.DB_USER_SOLOCHAIN_SEARCH,
      pass: process.env.DB_PASS_SOLOCHAIN_SEARCH
    },
    {
      name: 'node-manager',
      reset: process.env.RESET_NODE_MANAGER === 'true',
      resetHeight: parseResetHeight(process.env.RESET_HEIGHT_NODE_MANAGER),
      db: process.env.DB_SCHEMA_NODEMANAGER,
      user: process.env.DB_USER_NODEMANAGER,
      pass: process.env.DB_PASS_NODEMANAGER
    },
    {
      name: 'assets',
      reset: process.env.RESET_ASSETS === 'true',
      resetHeight: parseResetHeight(process.env.RESET_HEIGHT_ASSETS),
      db: process.env.DB_SCHEMA_ASSETS,
      user: process.env.DB_USER_ASSETS,
      pass: process.env.DB_PASS_ASSETS
    }
  ])
