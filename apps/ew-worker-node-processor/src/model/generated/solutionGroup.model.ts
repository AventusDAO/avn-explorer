import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"
import {CalculatedRewards} from "./_calculatedRewards"

@Entity_()
export class SolutionGroup {
    constructor(props?: Partial<SolutionGroup>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    votingReward!: bigint | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    subscriptionReward!: bigint | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    unclaimedRewards!: bigint | undefined | null

    @Column_("int4", {nullable: true})
    remainingBlocks!: number | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    reservedFunds!: bigint | undefined | null

    @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.toJSON(), from: obj => obj == null ? undefined : new CalculatedRewards(undefined, obj)}, nullable: true})
    calculatedRewards!: CalculatedRewards | undefined | null
}
