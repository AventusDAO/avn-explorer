import type { GetBalancesQuery } from './graphql/generated'

export type Balances = GetBalancesQuery['balances'][0]['accountId'][0]
