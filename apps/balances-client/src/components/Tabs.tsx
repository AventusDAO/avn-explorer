export type TabsProps = {
  tabs: string[]
  activeTab: string
  setActiveTab: (e) => void
}
export function Tabs({ tabs, activeTab, setActiveTab }: TabsProps) {
  return (
    <ul className='flex flex-wrap text-sm font-medium justify-around text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400'>
      {tabs.map(t => {
        return (
          <li
            className='mr-2'
            onClick={e => {
              e.preventDefault()
              setActiveTab(t)
            }}
          >
            <a
              href='#'
              className='inline-block p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
            >
              {t}
            </a>
          </li>
        )
      })}
    </ul>
  )
}
