type TableBodyProps<T> = {
  items: T[]
}
export function TableBody<T extends object>({ items }: TableBodyProps<T>) {
  const keys = Object.keys(items?.[0]).filter(head => !['__typename', 'id'].includes(head))
  return (
    <tbody>
      {items.map(item => {
        return (
          <tr className='border-b' key={item.id}>
            {keys.map(k => {
              return (
                <td
                  className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'
                  key={k}
                >
                  {item[k]}
                </td>
              )
            })}
          </tr>
        )
      })}
    </tbody>
  )
}
