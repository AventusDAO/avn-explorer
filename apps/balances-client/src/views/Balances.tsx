import { useState } from 'react'
import { useQuery, UseQueryState } from 'urql'
import { TabsEnum } from '../App'
import { RecentBalance } from '../components/RecentBalance'
import { Table, Balance } from '../components/Table'
import {
  GetBalancesDocument,
  GetBalancesForAccountDocument
} from '../graphql/generated-balances-types'

export function AccountBalances() {
  const [accountId, setAccountId] = useState('')

  let query: any
  let variables: { accountId?: string } = {}

  if (!accountId) {
    query = GetBalancesDocument
  } else {
    query = GetBalancesForAccountDocument
    variables = { accountId }
  }
  const result = useQuery({ query, variables })[0]

  if (!result) {
    throw new Error('no data fetched')
  }

  const { fetching, error, data } = result

  return (
    <>
      <input type='text' className='' onChange={e => setAccountId(e.target.value)} />
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
        <h3>Loading...</h3>
      ) : error ? (
        <h3 className='text-red-400'>{error.message}</h3>
      ) : !data.balances.length ? (
        <h3>No results!</h3>
      ) : (
        <Table<Balance> data={data?.balances} />
      )}
    </>
  )
}
