import type { GetBalancesQuery } from './graphql/generated-balances-types'

export type Balances = GetBalancesQuery['balances'][0]['accountId'][0]
