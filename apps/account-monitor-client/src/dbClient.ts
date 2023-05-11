import { Client } from 'pg'

export class DbClient {
  private readonly client: Client

  constructor(config: any) {
    this.client = new Client(config)
  }

  async connect() {
    await this.client.connect()
  }

  async disconnect() {
    await this.client.end()
  }

  async query(sql: string, params?: any[]) {
    return await this.client.query(sql, params)
  }
}

export default DbClient
