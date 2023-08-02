import assert from "assert"
import * as marshal from "./marshal"

export class NftRoyaltyRate {
    private _partsPerMillion!: number

    constructor(props?: Partial<Omit<NftRoyaltyRate, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._partsPerMillion = marshal.int.fromJSON(json.partsPerMillion)
        }
    }

    get partsPerMillion(): number {
        assert(this._partsPerMillion != null, 'uninitialized access')
        return this._partsPerMillion
    }

    set partsPerMillion(value: number) {
        this._partsPerMillion = value
    }

    toJSON(): object {
        return {
            partsPerMillion: this.partsPerMillion,
        }
    }
}
