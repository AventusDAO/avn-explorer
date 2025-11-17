import { Store } from '@subsquid/typeorm-store'

export class ServiceManager {
  private services = new Map<string, any>()
  private initialized = new Set<string>()

  constructor(private store: Store, private log?: any) {}

  register<T>(name: string, factory: () => T): T {
    if (!this.services.has(name)) {
      this.services.set(name, factory())
      this.log?.debug(`Registered service: ${name}`)
    }
    return this.services.get(name)
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
        const errorMessage = error instanceof Error ? error.message : String(error)
        this.log?.error(`Failed to initialize service ${name}: ${errorMessage}`)
        throw error
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
