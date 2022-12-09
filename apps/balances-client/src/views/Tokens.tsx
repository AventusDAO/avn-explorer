import { useState } from 'react'
import { useQuery } from 'urql'
import { TabsEnum } from '../App'
import { RecentBalance } from '../components/RecentBalance'
import { Table } from '../components/Table'
import {
  GetTokenBalancesDocument,
  GetTokenBalancesForAccountAndTokenDocument,
  GetTokenBalancesForAccountDocument,
  GetTokenBalancesForTokenDocument
} from '../graphql/generated-tokens-types'

export function TokenBalances() {
  const [accountId, setAccountId] = useState('')
  const [tokenId, setTokenId] = useState('')

  let result = {}
  if (!accountId && !tokenId) {
    result = useQuery({
      query: GetTokenBalancesDocument
    })?.[0]
  } else if (!accountId) {
    result = useQuery({
      query: GetTokenBalancesForTokenDocument,
      variables: { tokenId }
    })?.[0]
  } else if (!tokenId) {
    result = useQuery({
      query: GetTokenBalancesForAccountDocument,
      variables: { accountId }
    })?.[0]
  } else {
    result = useQuery({
      query: GetTokenBalancesForAccountAndTokenDocument,
      variables: { accountId, tokenId }
    })?.[0]
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
        <Table data={data.tokenBalanceForAccounts} />
      )}
    </>
  )
}
