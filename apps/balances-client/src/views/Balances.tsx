import { useState, useMemo } from 'react'
import { useQuery, UseQueryState } from 'urql'
import { TabsEnum } from '../App'
import { RecentBalance } from '../components/RecentBalance'
import { Table, Balance } from '../components/Table'
import {
  GetBalancesDocument,
  GetBalancesForAccountDocument
} from '../graphql/generated-balances-types'
import { Loading, Error, NoResults } from '../components/States'

const queries = {
  '': {
    query: GetBalancesDocument,
    variables: {}
  },
  account: {
    query: GetBalancesForAccountDocument,
    variables: (accountId: string) => ({ accountId })
  }
}

export function AccountBalances() {
  const [accountId, setAccountId] = useState('')

  const key = accountId ? 'account' : ''

  const { query, variables } = useMemo(() => queries[key], [accountId])
  const result: UseQueryState<any, { accountId?: string }> = useQuery({
    query,
    variables: typeof variables === 'function' ? variables(accountId) : variables
  })[0]

  if (!result) {
    throw new Error({ error: 'no data fetched' })
  }
  const { fetching, error, data } = result

  return (
    <>
      <div>
        <label htmlFor='address' className='block text-sm font-medium text-gray-700'>
          Account address
        </label>
        <div className='relative mt-1 rounded-md shadow-lg'>
          <input
            type='text'
            name='address'
            id='address'
            placeholder='Set account address'
            onChange={e => {
              e.preventDefault()
              setAccountId(e.target.value)
            }}
            className='block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
          />
        </div>
      </div>
      <RecentBalance accountId={accountId} pageType={TabsEnum.BALANCE} />
      {fetching ? (
        <Loading />
      ) : error ? (
        <Error error={error} />
      ) : !data.balances.length ? (
        <NoResults />
      ) : (
        <Table<Balance> data={data?.balances} />
      )}
    </>
  )
}
