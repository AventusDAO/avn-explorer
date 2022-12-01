import { useState } from 'react'
import { TableBody } from './TableBody'
import { TableHeading } from './TableHeading'

export type Balance = {
  id: string
  accountId: string
  free: string
  reserved: string
  total: string
  updatedAt: number
}

type TableProps = {
  data?: Balance[]
}

export function Table(props: TableProps) {
  const [pageNumber, setPageNumber] = useState(0)
  const [recordsPerPage, setRecordsPerPage] = useState(10)
  const balances = props?.data
  // display the most recent total balance instead of the account id

  if (!balances) return

  const headings = Object.keys(balances[0]).filter(head => !['__typename', 'id'].includes(head))
  const pageIndex = pageNumber * recordsPerPage
  const items = balances
    .sort((a, b) => (a.total < b.total ? 1 : -1))
    .slice(pageIndex, pageIndex + recordsPerPage)

  return (
    <div className='flex flex-col'>
      <div className='overflow-x-auto sm:-mx-6 lg:-mx-8'>
        <div className='py-2 inline-block min-w-full sm:px-6 lg:px-8'>
          <div className='overflow-hidden'>
            <table className='min-w-full'>
              <TableHeading headings={headings} />
              <TableBody items={items} />
            </table>
          </div>
          <div className='flex flex-row justify-between'>
            <button
              onClick={e => {
                e.preventDefault()
                if (pageNumber > 0) setPageNumber(pageNumber - 1)
              }}
            >
              prev
            </button>{' '}
            <button
              onClick={e => {
                e.preventDefault()
                if (balances.length / recordsPerPage >= pageNumber) setPageNumber(pageNumber + 1)
              }}
            >
              next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
