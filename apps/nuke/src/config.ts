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
  reset: boolean
  db?: string
  user?: string
  pass?: string
  resetIndexes?: boolean
  esUrl?: string
  esBlocksIndex?: string
  esExtrinsicsIndex?: string
  esEventsIndex?: string
}

export const getDbConfigs: () => Readonly<DatabaseConfig[]> = () =>
  Object.freeze([
    {
      name: 'archive',
      reset: process.env.RESET_ARCHIVE === 'true',
      db: process.env.DB_SCHEMA_ARCHIVE,
      user: process.env.DB_USER_ARCHIVE,
      pass: process.env.DB_PASS_ARCHIVE
    },
    {
      name: 'errors',
      reset: process.env.RESET_ERRORS === 'true',
      db: process.env.DB_SCHEMA_ERRORS,
      user: process.env.DB_USER_ERRORS,
      pass: process.env.DB_PASS_ERRORS
    },
    {
      name: 'fees',
      reset: process.env.RESET_FEES === 'true',
      db: process.env.DB_SCHEMA_FEES,
      user: process.env.DB_USER_FEES,
      pass: process.env.DB_PASS_FEES
    },
    {
      name: 'balances',
      reset: process.env.RESET_BALANCES === 'true',
      db: process.env.DB_SCHEMA_BALANCES,
      user: process.env.DB_USER_BALANCES,
      pass: process.env.DB_PASS_BALANCES
    },
    {
      name: 'staking',
      reset: process.env.RESET_STAKING === 'true',
      db: process.env.DB_SCHEMA_STAKING,
      user: process.env.DB_USER_STAKING,
      pass: process.env.DB_PASS_STAKING
    },
    {
      name: 'summary',
      reset: process.env.RESET_SUMMARY === 'true',
      db: process.env.DB_SCHEMA_SUMMARY,
      user: process.env.DB_USER_SUMMARY,
      pass: process.env.DB_PASS_SUMMARY
    },
    {
      name: 'tokens',
      reset: process.env.RESET_TOKENS === 'true',
      db: process.env.DB_SCHEMA_TOKENS,
      user: process.env.DB_USER_TOKENS,
      pass: process.env.DB_PASS_TOKENS
    },
    {
      name: 'account-monitor',
      reset: process.env.RESET_ACCOUNT_MONITOR === 'true',
      db: process.env.DB_SCHEMA_ACCOUNT_MONITOR,
      user: process.env.DB_USER_ACCOUNT_MONITOR,
      pass: process.env.DB_PASS_ACCOUNT_MONITOR
    },
    {
      name: 'nft',
      reset: process.env.RESET_NFT === 'true',
      db: process.env.DB_SCHEMA_NFT,
      user: process.env.DB_USER_NFT,
      pass: process.env.DB_PASS_NFT
    },
    {
      name: 'search',
      reset: process.env.RESET_SEARCH === 'true',
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
      db: process.env.DB_SCHEMA_SOLOCHAIN_SEARCH,
      user: process.env.DB_USER_SOLOCHAIN_SEARCH,
      pass: process.env.DB_PASS_SOLOCHAIN_SEARCH
    },
    {
      name: 'node-manager',
      reset: process.env.RESET_NODE_MANAGER === 'true',
      db: process.env.DB_SCHEMA_NODEMANAGER,
      user: process.env.DB_USER_NODEMANAGER,
      pass: process.env.DB_PASS_NODEMANAGER
    }
  ])
