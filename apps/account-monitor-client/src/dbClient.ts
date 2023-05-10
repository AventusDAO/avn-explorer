import { Pool, PoolClient } from 'pg'
import { EventEmitter } from 'events'

export interface IDbConfig {
  host?: string
  port?: number
  database?: string
  user?: string
  password?: string
  ssl?: boolean
}

export class DbClient extends EventEmitter {
  private readonly pool: Pool
  private client: PoolClient | null = null

  constructor(config: IDbConfig) {
    super() // Call the EventEmitter constructor
    this.pool = new Pool(config)

    this.initialize().catch(error => {
      console.error('Failed to initialize DB client', error)
      process.exit(1)
    })
  }

  private async initialize() {
    this.client = await this.pool.connect()

    // Listen for 'new_transfer' notifications
    await this.client.query('LISTEN new_transfer')

    // When we receive a notification, emit a 'new-record' event
    this.client.on('notification', async (msg: any) => {
      if (!msg.payload) return
      const id = msg.payload

      // Fetch the record from the database using parameterized query
      try {
        const res = await this.query('SELECT * FROM transfer WHERE id = $1', [id])
        if (res.rows.length > 0) {
          const record = res.rows[0]
          this.emit('new-record', record)
        }
      } catch (err) {
        console.error('Failed to fetch new record', err)
      }
    })
  }

  async connect() {
    const client = await this.pool.connect()
    return client
  }

  async disconnect() {
    await this.pool.end()
    if (this.client) {
      this.client.release()
      this.client = null
    }
  }

  async query(sql: string, params?: any[]) {
    const client = await this.connect()
    try {
      const res = await client.query(sql, params)
      return res
    } finally {
      client.release()
    }
  }
}

export default DbClient
