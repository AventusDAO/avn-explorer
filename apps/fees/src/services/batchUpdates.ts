import { Address, AddressHex } from '@avn/types'
import { toHex } from '@subsquid/substrate-processor'
import { IFeePaidData, IFeesAccountUpdate } from '../types/custom'

export class BatchUpdates {
  #updates = new Map<AddressHex, IFeesAccountUpdate>()

  private getItem(id: Address): IFeesAccountUpdate | undefined {
    const hexId = toHex(id)
    return this.#updates.get(hexId)
  }

  private setItem(update: IFeesAccountUpdate): void {
    const hexId = toHex(update.id)
    this.#updates.set(hexId, update)
  }

  addFeePaid(data: IFeePaidData): void {
    const { who: id, actualFee, tip } = data
    const item = this.getItem(id)
    const fee = actualFee - tip

    if (!item) {
      return this.setItem({
        id,
        fees: [fee],
        tips: [tip]
      })
    }

    item.fees.push(fee)
    item.tips.push(tip)
  }

  async getAllData(): Promise<IFeesAccountUpdate[]> {
    return [...this.#updates.values()]
  }

  clear(): void {
    this.#updates.clear()
  }
}
