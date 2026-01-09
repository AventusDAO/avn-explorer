import { Store } from '@subsquid/typeorm-store'
import { BaseService } from './base-service'

export class ServiceManager extends BaseService {
  private services = new Map<string, any>()
  private initialized = new Set<string>()

  constructor(store: Store, log?: any) {
    super(store, log)
  }

  register<T>(name: string, factory: () => T): T {
    if (!this.services.has(name)) {
      this.services.set(name, factory())
      this.log?.debug(`Registered service: ${name}`)
    }
    return this.get<T>(name) as T
  }

  get<T>(name: string): T | undefined {
    return this.services.get(name) as T | undefined
  }

  async initialize(name: string, initFn: () => Promise<void>): Promise<void> {
    if (!this.initialized.has(name)) {
      try {
        await initFn()
        this.initialized.add(name)
        this.log?.debug(`Initialized service: ${name}`)
      } catch (error) {
        this.handleAndThrow(error, {
          service: name,
          operation: 'initialize'
        })
      }
    }
  }

  isInitialized(name: string): boolean {
    return this.initialized.has(name)
  }

  clear(): void {
    this.services.clear()
    this.initialized.clear()
  }
}
