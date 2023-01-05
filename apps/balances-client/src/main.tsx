import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { createClient, Provider } from 'urql'

export const balancesClient = createClient({
  url: import.meta.env.VITE_BALANCES_URL || 'http://localhost:4350/graphql'
})

export const stakingClient = createClient({
  url: import.meta.env.VITE_STAKING_URL || 'http://localhost:4352/graphql'
})

export const tokensClient = createClient({
  url: import.meta.env.VITE_TOKENS_URL || 'http://localhost:4351/graphql'
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
