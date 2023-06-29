// @ts-ignore next-line
import { Client } from 'pg'
import { ApiPromise, WsProvider } from '@polkadot/api'

async function getApi() {
  const wsProvider = new WsProvider(process.env.CHAIN_URL)
  const api = await ApiPromise.create({ provider: wsProvider })
  return api
}

async function getData() {
  // The data to be inserted
  const coins = [
    {
      tokenId: '0x1bbf25e71ec48b84d773809b4ba55b6f4be946fb',
      tokenName: 'VOW'
    },
    {
      tokenId: '0x6364d4f283601d4beb170dcdf0080b84e056389a',
      tokenName: 'vGBP'
    },
    {
      tokenId: '0x0e7f502e5e4fba9c65c59989b68d31e5f5093f50',
      tokenName: 'vZAR'
    },
    {
      tokenId: '0xbb337937b31ef383d6782bfa9e88a131b7fcf531',
      tokenName: 'vDKK'
    },
    {
      tokenId: '0xbf686da68323d0425f2b0d7e33d3fa11b1239132',
      tokenName: 'vEUR'
    },
    {
      tokenId: '0x36efd50912e8bbdcfddb71344ca1c28b53347bc0',
      tokenName: 'vINR'
    },
    {
      tokenId: '0x0fc6c0465c9739d4a42daca22eb3b2cb0eb9937a',
      tokenName: 'vUSD'
    },
    {
      tokenId: '0x663cbf0f8ac632ff6eea2a249e2f6e147e65a04b',
      tokenName: 'vZWL'
    },
    {
      tokenId: '0xf3d127db17136dea1887dfbafdbbf8ee1177f1aa',
      tokenName: 'PIP'
    }
  ]
  const api = await getApi()

  const avtContractId = await api.query.tokenManager.avtTokenContract()
  return [...coins, { tokenId: avtContractId.toString(), tokenName: 'AVT' }]
}

async function connectToDatabase() {
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: parseInt(process.env.DB_PORT ?? '5432')
  })
  await client.connect()
  return client
}

async function insertData() {
  const client = await connectToDatabase()
  const data = await getData()
  try {
    const query = 'INSERT INTO token_lookup (token_id, token_name) VALUES ($1, $2)'
    for (const item of data) {
      const values = [item.tokenId, item.tokenName]
      await client.query(query, values)
    }
    console.log('Data inserted successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Error inserting data:', error)
    process.exit(1)
  }
}

insertData().catch(console.error)
