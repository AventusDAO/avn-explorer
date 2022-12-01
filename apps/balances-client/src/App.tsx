import { useState } from 'react'
import './index.css'
import { useQuery } from 'urql'
import { GetBalancesDocument, GetBalancesForAccountDocument } from './graphql/generated'
import { Table } from './components/Table'
import { RecentBalance } from './components/RecentBalance'

function App() {
  const [accountId, setAccountId] = useState('')
  let result = {}
  if (!accountId) {
    result = useQuery({
      query: GetBalancesDocument
    })?.[0]
  } else {
    result = useQuery({
      query: GetBalancesForAccountDocument,
      variables: { accountId }
    })?.[0]
  }

  const { fetching, error, data } = result

  return (
    <div className='bg-pearl-800 flex-col h-screen w-full flex items-center justify-center p-4 gap-y-12'>
      <h2 className='text-4xl text-black-500'>AvT Balances Explorer</h2>
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
            onChange={e => {
              e.preventDefault()
              setAccountId(e.target.value)
            }}
            className='block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
          />
        </div>
      </div>
      <RecentBalance accountId={accountId} />
      {fetching ? (
        <h3>Loading...</h3>
      ) : error ? (
        <h3 className='text-red-400'>{error.message}</h3>
      ) : !data.balances.length ? (
        <h3>No results!</h3>
      ) : (
        <Table data={data.balances} />
      )}
    </div>
  )
}

export default App
