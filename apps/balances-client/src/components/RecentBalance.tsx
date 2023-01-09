import { useQuery } from 'urql'
import { TabsEnum } from '../App'
import { GetMostRecentBalanceRecordForAccountDocument } from '../graphql/generated-balances-types'
import { GetMostRecentTokenBalanceRecordForAccountDocument } from '../graphql/generated-tokens-types'

type RecentBalanceProps = {
  accountId: string
  pageType: TabsEnum
  tokenId?: string
}
export function RecentBalance({
  accountId = '',
  pageType,
  tokenId = ''
}: RecentBalanceProps): JSX.Element {
  if (!accountId || !tokenId) {
    return <div></div>
  }
  let query: any
  let variables: { accountId?: string; tokenId?: string } = {}
  if (pageType === TabsEnum.BALANCE) {
    query = GetMostRecentBalanceRecordForAccountDocument
    variables = { accountId }
  } else {
    if (tokenId) {
      query = GetMostRecentTokenBalanceRecordForAccountDocument
      variables = { accountId, tokenId }
    }
  }
  const result = useQuery({ query, variables })[0]
  const totalBalance = result?.data?.balances?.[0]?.total
  if (totalBalance) {
    return (
      <div>
        <h3>Most recent balance: {totalBalance}</h3>
      </div>
    )
  } else {
    return <div></div>
  }
}
