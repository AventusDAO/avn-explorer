import assert from "assert"
import * as marshal from "./marshal"

export class CalculatedRewards {
    private _reward1!: bigint
    private _reward2!: bigint

    constructor(props?: Partial<Omit<CalculatedRewards, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._reward1 = marshal.bigint.fromJSON(json.reward1)
            this._reward2 = marshal.bigint.fromJSON(json.reward2)
        }
    }

    get reward1(): bigint {
        assert(this._reward1 != null, 'uninitialized access')
        return this._reward1
    }

    set reward1(value: bigint) {
        this._reward1 = value
    }

    get reward2(): bigint {
        assert(this._reward2 != null, 'uninitialized access')
        return this._reward2
    }

    set reward2(value: bigint) {
        this._reward2 = value
    }

    toJSON(): object {
        return {
            reward1: marshal.bigint.toJSON(this.reward1),
            reward2: marshal.bigint.toJSON(this.reward2),
        }
    }
}
