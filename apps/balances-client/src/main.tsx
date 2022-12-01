import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { createClient, Provider } from 'urql'

const client = createClient({
  url: import.meta.env.VITE_API_URL || 'http://localhost:4350/graphql'
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider value={client}>
      <App />
    </Provider>
  </React.StrictMode>
)
