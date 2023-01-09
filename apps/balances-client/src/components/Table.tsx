import { useState } from 'react'
import { TableBody } from './TableBody'
import { TableHeading } from './TableHeading'

export class Balance {
  id: string = ''
  accountId: string = ''
  free: string = ''
  reserved: string = ''
  total: string = ''
  updatedAt: number = 0
}

export class TokenBalance {
  id: string = ''
  tokenId: string = ''
  amount: string = ''
  accountId: string = ''
}

export class Staking {
  id: string = ''
  rewardsTotal: string = ''
  stakedAmountTotal: string = ''
  updatedAt: string = ''
  accountId?: string
}

type TableProps<T> = {
  data?: T[]
}

export function Table<T extends object>(props: TableProps<T>): JSX.Element {
  const [pageNumber, setPageNumber] = useState(0)
  const [recordsPerPage, setRecordsPerPage] = useState(10)
  const data = props.data

  if (!data) return <div>no data</div>

  const headings = Object.keys(data[0]).filter(head => !['__typename', 'id'].includes(head))
  const pageIndex = pageNumber * recordsPerPage
  const maxPageNumber = Math.floor((data.length - 1) / recordsPerPage)

  const items = data
    .sort((a, b) => {
      if (a instanceof Balance && b instanceof Balance) {
        return a.total < b.total ? 1 : -1
      } else if (a instanceof TokenBalance && b instanceof TokenBalance) {
        return a.amount < b.amount ? 1 : -1
      } else if (a instanceof Staking && b instanceof Staking) {
        return a.rewardsTotal < b.rewardsTotal ? 1 : -1
      }
      return 0
    })
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
            {pageNumber > 0 ? (
              <button
                onClick={e => {
                  e.preventDefault()
                  if (pageNumber > 0) setPageNumber(pageNumber - 1)
                }}
              >
                prev
              </button>
            ) : (
              ''
            )}

            {maxPageNumber > pageNumber ? (
              <button
                onClick={e => {
                  e.preventDefault()
                  if (maxPageNumber > pageNumber) setPageNumber(pageNumber + 1)
                }}
              >
                next
              </button>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
