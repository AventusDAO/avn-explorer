export class ResultAggregator<TKey, TValue> {
  private map = new Map<TKey, TValue>()

  add(key: TKey, value: TValue): void {
    this.map.set(key, value)
  }

  addFromMap(map: Map<TKey, TValue>): void {
    for (const [key, value] of map.entries()) {
      this.add(key, value)
    }
  }

  addFromArray(items: TValue[], keyExtractor: (item: TValue) => TKey): void {
    for (const item of items) {
      this.add(keyExtractor(item), item)
    }
  }

  getValues(): TValue[] {
    return Array.from(this.map.values())
  }

  getMap(): Map<TKey, TValue> {
    return new Map(this.map)
  }

  clear(): void {
    this.map.clear()
  }
}
