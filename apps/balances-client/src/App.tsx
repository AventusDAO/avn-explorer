import { useState } from 'react'
import { Provider } from 'urql'
import './index.css'

import { Tabs } from './components/Tabs'
import { AccountBalances } from './views/Balances'
import { TokenBalances } from './views/Tokens'
import { balancesClient, tokensClient } from './main'

export enum TabsEnum {
  BALANCE = 'balances',
  TOKENS = 'tokens'
}

function App() {
  const [activeTab, setActiveTab] = useState<TabsEnum>(TabsEnum.BALANCE)

  return (
    <div className='bg-pearl-800 flex-col h-full w-full flex items-center justify-center p-4 gap-y-12'>
      <h2 className='text-4xl text-black-500'>AvT Explorer</h2>
      <Tabs
        tabs={[TabsEnum.BALANCE, TabsEnum.TOKENS]}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      {activeTab === TabsEnum.BALANCE ? (
        <Provider value={balancesClient}>
          <AccountBalances />
        </Provider>
      ) : (
        <Provider value={tokensClient}>
          <TokenBalances />
        </Provider>
      )}
    </div>
  )
}

export default App
