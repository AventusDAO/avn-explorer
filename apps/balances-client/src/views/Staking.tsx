import { useMemo, useState } from 'react'
import { useQuery, UseQueryState } from 'urql'
import { Loading, NoResults } from '../components/States'
import { Staking, Table } from '../components/Table'
import { GetAccountByIdDocument, GetAccountsDocument } from '../graphql/generated-staking-types'

const queries = {
  '': {
    query: GetAccountsDocument,
    variables: {}
  },
  id: {
    query: GetAccountByIdDocument,
    variables: (accountId: string) => ({ accountId })
  }
}

function formatStakingAccountData(data: Staking[]): Staking[] {
  return data.map((entry: Staking) => ({ accountId: entry.id, ...entry }))
}

export function StakingView() {
  const [accountId, setAccountId] = useState('')
  const key = accountId ? 'id' : ''

  const { query, variables } = queries[key]
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
      {fetching ? (
        <Loading />
      ) : error ? (
        <Error error={error} />
      ) : !data.accounts.length ? (
        <NoResults />
      ) : (
        <Table<Staking> data={formatStakingAccountData(data?.accounts)} />
      )}
    </>
  )
}
