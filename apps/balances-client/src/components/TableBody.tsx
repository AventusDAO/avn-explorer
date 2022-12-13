type HasId = {
  id?: string
}

type TableBodyProps<T extends HasId> = {
  items: T[]
}
export function TableBody<T extends HasId>({ items }: TableBodyProps<T>) {
  const keys = Object.keys(items?.[0]).filter(head => !['__typename', 'id'].includes(head))
  return (
    <tbody>
      {items.map((item: any) => {
        return (
          <tr className='border-b' key={item?.['id']}>
            {keys.map((k: string) => {
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
