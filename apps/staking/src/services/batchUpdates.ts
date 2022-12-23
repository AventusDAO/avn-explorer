import { Address, AddressHex } from '@avn/types'
import { toHex } from '@subsquid/substrate-processor'
import { Context } from '../processor'
import { IRewardedData, IStakingAccountUpdate } from '../types/custom'
import { Block } from '../types/generated/parachain-dev/support'
import { getNominations } from './accounts'

export class BatchUpdates {
  #ctx: Context
  #updates = new Map<AddressHex, IStakingAccountUpdate>()

  constructor(ctx: Context) {
    this.#ctx = ctx
  }

  private getItem(id: Address): IStakingAccountUpdate | undefined {
    const hexId = toHex(id)
    return this.#updates.get(hexId)
  }

  private setItem(update: IStakingAccountUpdate): void {
    const hexId = toHex(update.id)
    this.#updates.set(hexId, update)
  }

  addNominator(id: Address): void {
    const item = this.getItem(id)
    if (!item) {
      return this.setItem({
        id,
        hasNominations: true,
        rewards: []
      })
    }

    item.hasNominations = true
  }

  addReward(data: IRewardedData): void {
    const { id, amount } = data
    const item = this.getItem(id)
    if (!item) {
      return this.setItem({
        id: data.id,
        hasNominations: false,
        rewards: [data.amount]
      })
    }

    item.rewards.push(amount)
  }

  private async fetchTotalNominations(block: Block): Promise<void> {
    const nominatorIds = [...this.#updates.values()]
      .filter(acc => !!acc.hasNominations)
      .map(acc => acc.id)
    const nominationsData = await getNominations(this.#ctx, block, nominatorIds)
    nominationsData.forEach(nominator => {
      const update = this.#updates.get(toHex(nominator.id))
      if (!update) throw new Error(`Could not find pending update for a nominator`)
      update.nominationsTotal = nominator.total
    })
  }

  async getAndPrepareAllData(block: Block): Promise<IStakingAccountUpdate[]> {
    await this.fetchTotalNominations(block)
    return [...this.#updates.values()]
  }

  clear(): void {
    this.#updates.clear()
  }
}
