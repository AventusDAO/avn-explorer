export interface SchemaConfig {
  reset: boolean
  schema?: string
  user?: string
  pass?: string
}

export const getSchemaConfigs: () => Readonly<SchemaConfig[]> = () =>
  Object.freeze([
    {
      reset: process.env.RESET_ARCHIVE === 'true',
      schema: process.env.DB_SCHEMA_ARCHIVE,
      user: process.env.DB_USER_ARCHIVE,
      pass: process.env.DB_PASS_ARCHIVE
    },
    {
      reset: process.env.RESET_FEES === 'true',
      schema: process.env.DB_SCHEMA_FEES,
      user: process.env.DB_USER_FEES,
      pass: process.env.DB_PASS_FEES
    },
    {
      reset: process.env.RESET_BALANCES === 'true',
      schema: process.env.DB_SCHEMA_BALANCES,
      user: process.env.DB_USER_BALANCES,
      pass: process.env.DB_PASS_BALANCES
    },
    {
      reset: process.env.RESET_STAKING === 'true',
      schema: process.env.DB_SCHEMA_STAKING,
      user: process.env.DB_USER_STAKING,
      pass: process.env.DB_PASS_STAKING
    },
    {
      reset: process.env.RESET_SUMMARY === 'true',
      schema: process.env.DB_SCHEMA_SUMMARY,
      user: process.env.DB_USER_SUMMARY,
      pass: process.env.DB_PASS_SUMMARY
    },
    {
      reset: process.env.RESET_TOKENS === 'true',
      schema: process.env.DB_SCHEMA_TOKENS,
      user: process.env.DB_USER_TOKENS,
      pass: process.env.DB_PASS_TOKENS
    }
  ])
