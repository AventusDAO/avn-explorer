import { GetMostRecentBalanceRecordForAccountDocument } from '../graphql/generated'
import { useQuery } from 'urql'

type RecentBalanceProps = {
  accountId: string
}
export function RecentBalance({ accountId }: RecentBalanceProps) {
  if (!accountId) {
    return <div></div>
  }
  const recentBalanceResult = useQuery({
    query: GetMostRecentBalanceRecordForAccountDocument,
    variables: { accountId }
  })?.[0]

  const totalBalance = recentBalanceResult?.data?.balances?.[0]?.total
  if (totalBalance) {
    return (
      <>
        <h3>Total balance: {totalBalance}</h3>
      </>
    )
  }
}
