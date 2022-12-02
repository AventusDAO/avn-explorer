import { useQuery } from 'urql'
import { TabsEnum } from '../App'
import { GetMostRecentBalanceRecordForAccountDocument } from '../graphql/generated-balances-types'
import { GetMostRecentTokenBalanceRecordForAccountDocument } from '../graphql/generated-tokens-types'

type RecentBalanceProps = {
  accountId: string
  pageType: TabsEnum
  tokenId?: string
}
export function RecentBalance({ accountId, pageType, tokenId }: RecentBalanceProps) {
  if (!accountId) {
    return <div></div>
  }
  let recentBalanceResult
  if (pageType === TabsEnum.BALANCE) {
    recentBalanceResult = useQuery({
      query: GetMostRecentBalanceRecordForAccountDocument,
      variables: { accountId }
    })?.[0]
  } else {
    if (tokenId) {
      recentBalanceResult = useQuery({
        query: GetMostRecentTokenBalanceRecordForAccountDocument,
        variables: { accountId, tokenId }
      })?.[0]
    }
  }

  const totalBalance = recentBalanceResult?.data?.balances?.[0]?.total
  if (totalBalance) {
    return (
      <>
        <h3>Most recent balance: {totalBalance}</h3>
      </>
    )
  }
}
