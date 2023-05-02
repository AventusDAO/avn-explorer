export interface SchemaConfig {
  name: 'archive' | 'fees' | 'balances' | 'staking' | 'balances' | 'summary' | 'tokens' | 'search'
  reset: boolean
  schema?: string
  user?: string
  pass?: string
  esUrl?: string
  esBlocksIndex?: string
  esExtrinsicsIndex?: string
  esEventsIndex?: string
}

export const getSchemaConfigs: () => Readonly<SchemaConfig[]> = () =>
  Object.freeze([
    {
      name: 'archive',
      reset: process.env.RESET_ARCHIVE === 'true',
      schema: process.env.DB_SCHEMA_ARCHIVE,
      user: process.env.DB_USER_ARCHIVE,
      pass: process.env.DB_PASS_ARCHIVE
    },
    {
      name: 'fees',
      reset: process.env.RESET_FEES === 'true',
      schema: process.env.DB_SCHEMA_FEES,
      user: process.env.DB_USER_FEES,
      pass: process.env.DB_PASS_FEES
    },
    {
      name: 'balances',
      reset: process.env.RESET_BALANCES === 'true',
      schema: process.env.DB_SCHEMA_BALANCES,
      user: process.env.DB_USER_BALANCES,
      pass: process.env.DB_PASS_BALANCES
    },
    {
      name: 'staking',
      reset: process.env.RESET_STAKING === 'true',
      schema: process.env.DB_SCHEMA_STAKING,
      user: process.env.DB_USER_STAKING,
      pass: process.env.DB_PASS_STAKING
    },
    {
      name: 'summary',
      reset: process.env.RESET_SUMMARY === 'true',
      schema: process.env.DB_SCHEMA_SUMMARY,
      user: process.env.DB_USER_SUMMARY,
      pass: process.env.DB_PASS_SUMMARY
    },
    {
      name: 'tokens',
      reset: process.env.RESET_TOKENS === 'true',
      schema: process.env.DB_SCHEMA_TOKENS,
      user: process.env.DB_USER_TOKENS,
      pass: process.env.DB_PASS_TOKENS
    },
    {
      name: 'search',
      reset: process.env.RESET_SEARCH === 'true',
      schema: process.env.DB_SCHEMA_SEARCH,
      user: process.env.DB_USER_SEARCH,
      pass: process.env.DB_PASS_SEARCH,
      esUrl: process.env.ES_URL_SEARCH,
      esBlocksIndex: process.env.ES_BLOCKS_INDEX_SEARCH,
      esExtrinsicsIndex: process.env.ES_EXTRINSICS_INDEX_SEARCH,
      esEventsIndex: process.env.ES_EVENTS_INDEX_SEARCH
    }
  ])
