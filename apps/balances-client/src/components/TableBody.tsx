import { Balance } from './Table'

type TableBodyProps = {
  items: Balance[]
}
export function TableBody({ items }: TableBodyProps) {
  const keys = Object.keys(items[0]).filter(head => !['__typename', 'id'].includes(head))
  return (
    <tbody>
      {items.map(item => {
        return (
          <tr className='border-b' key={item.id}>
            {keys.map(k => {
              return (
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
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
