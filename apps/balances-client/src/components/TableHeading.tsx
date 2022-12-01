type TableHeadingProps = {
  headings: string[]
}
export function TableHeading({ headings }: TableHeadingProps) {
  return (
    <thead className='border-b'>
      <tr>
        {headings.map(h => {
          return (
            <th
              scope='col'
              className='text-sm font-medium text-gray-900 px-6 py-4 text-left'
              key={h}
            >
              {h}
            </th>
          )
        })}
      </tr>
    </thead>
  )
}
