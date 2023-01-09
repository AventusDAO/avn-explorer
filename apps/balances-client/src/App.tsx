import { useState } from 'react'
import { Provider } from 'urql'
import './index.css'

import { Tabs } from './components/Tabs'
import { AccountBalances } from './views/Balances'
import { TokenBalances } from './views/Tokens'
import { StakingView } from './views/Staking'
import { balancesClient, stakingClient, tokensClient } from './main'

export enum TabsEnum {
  BALANCE = 'balances',
  TOKENS = 'tokens',
  STAKING = 'staking'
}

function getTabContent(activeTab: TabsEnum) {
  if (activeTab === TabsEnum.BALANCE) {
    return (
      <Provider value={balancesClient}>
        <AccountBalances />
      </Provider>
    )
  }
  if (activeTab === TabsEnum.TOKENS) {
    return (
      <Provider value={tokensClient}>
        <TokenBalances />
      </Provider>
    )
  }
  if (activeTab === TabsEnum.STAKING) {
    return (
      <Provider value={stakingClient}>
        <StakingView />
      </Provider>
    )
  }
}

function App() {
  const [activeTab, setActiveTab] = useState<TabsEnum>(TabsEnum.BALANCE)

  return (
    <div className='bg-pearl-800 flex-col h-full w-full flex items-center justify-center p-4 gap-y-12'>
      <h2 className='text-4xl text-black-500'>AvT Explorer</h2>
      <Tabs tabs={[...Object.values(TabsEnum)]} activeTab={activeTab} setActiveTab={setActiveTab} />
      {getTabContent(activeTab)}
    </div>
  )
}

export default App
