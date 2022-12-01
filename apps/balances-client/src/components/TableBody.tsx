import { Balance } from './Table'

type TableBodyProps = {
  items: Balance[]
}
export function TableBody({ items }: TableBodyProps) {
  return (
    <tbody>
      {items.map(balance => {
        return (
          <tr className='border-b' key={balance.id}>
            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
              {balance.accountId}
            </td>

            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
              {balance.free}
            </td>
            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
              {balance.reserved}
            </td>
            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
              {balance.total}
            </td>
            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
              {balance.updatedAt}
            </td>
          </tr>
        )
      })}
    </tbody>
  )
}
