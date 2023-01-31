import { randomUUID } from 'crypto'
import { SummaryRoot } from '../model'
import { Context } from '../processor'

export class BatchUpdates {
  constructor(
    private readonly ctx: Context,
    private readonly updates: Map<string, SummaryRoot> = new Map<string, SummaryRoot>()
  ) {}

  private setItem(update: SummaryRoot): void {
    this.updates.set(`${update.toBlock}`, update)
  }

  private getItem(block: string): SummaryRoot | undefined {
    return this.updates.get(block)
  }

  addSummaryRootFromEvent({
    toBlock = 0,
    fromBlock = 0,
    isValidated = false,
    rootHash
  }: SummaryRoot): void {
    const item = this.getItem(`${toBlock}`)
    const newId = randomUUID()
    if (!item) {
      const summaryRoot = new SummaryRoot({
        toBlock,
        fromBlock,
        isValidated,
        rootHash,
        id: newId
      })
      this.setItem(summaryRoot)
    } else {
      const summaryRoot = new SummaryRoot({
        rootHash: rootHash ?? item.rootHash,
        toBlock,
        fromBlock,
        isValidated,
        id: item.id || newId
      })
      this.setItem(summaryRoot)
    }
  }

  getData(): SummaryRoot[] {
    return [...this.updates.values()]
  }

  clear(): void {
    this.updates.clear()
  }
}
