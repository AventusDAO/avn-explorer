import { useState } from 'react'
import { useQuery, UseQueryState } from 'urql'
import { TabsEnum } from '../App'
import { RecentBalance } from '../components/RecentBalance'
import { Table, TokenBalance } from '../components/Table'
import {
  GetTokenBalancesDocument,
  GetTokenBalancesForAccountAndTokenDocument,
  GetTokenBalancesForAccountDocument,
  GetTokenBalancesForTokenDocument
} from '../graphql/generated-tokens-types'

export function TokenBalances() {
  const [accountId, setAccountId] = useState('')
  const [tokenId, setTokenId] = useState('')

  let query
  let variables: { accountId?: string; tokenId?: string } = {}

  if (!accountId && !tokenId) {
    query = GetTokenBalancesDocument
  } else if (!accountId) {
    query = GetTokenBalancesForTokenDocument
    variables = { tokenId }
  } else if (!tokenId) {
    query = GetTokenBalancesForAccountDocument
    variables = { accountId }
  } else {
    query = GetTokenBalancesForAccountAndTokenDocument
    variables = { accountId, tokenId }
  }
  const result: UseQueryState<any, { accountId?: string; tokenId?: string }> = useQuery({
    query,
    variables
  })[0]

  if (!result) {
    throw new Error('no data fetched')
  }
  const { fetching, error, data } = result

  return (
    <>
      <div className='flex flex-row justify-between'>
        <div className='relative mt-1 rounded-md shadow-lg w-1/3'>
          <input
            type='text'
            className=''
            onChange={e => setAccountId(e.target.value)}
            placeholder='Set account id'
          />
        </div>
        <div className='relative mt-1 rounded-md shadow-lg w-1/3'>
          <input
            type='text'
            className=''
            onChange={e => setTokenId(e.target.value)}
            placeholder='Set token id'
          />
        </div>
      </div>
      <RecentBalance accountId={accountId} tokenId={tokenId} pageType={TabsEnum.TOKENS} />
      {fetching ? (
        <h3>Loading...</h3>
      ) : error ? (
        <h3 className='text-red-400'>{error.message}</h3>
      ) : !data.tokenBalanceForAccounts.length ? (
        <h3>No results!</h3>
      ) : (
        <Table<TokenBalance> data={data.tokenBalanceForAccounts} />
      )}
    </>
  )
}
