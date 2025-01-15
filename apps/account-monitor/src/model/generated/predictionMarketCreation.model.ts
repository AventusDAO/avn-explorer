import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_} from "typeorm"
import * as marshal from "./marshal"
import {Account} from "./account.model"

@Entity_()
export class PredictionMarketCreation {
    constructor(props?: Partial<PredictionMarketCreation>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    blockNumber!: bigint | undefined | null

    @Index_()
    @Column_("text", {nullable: true})
    amount!: string | undefined | null

    @Index_()
    @Column_("text", {nullable: true})
    baseAssetKind!: string | undefined | null

    @Column_("int4", {nullable: true})
    baseAssetValue!: number | undefined | null

    @Column_("int4", {nullable: true})
    creatorFee!: number | undefined | null

    @Column_("int4", {nullable: true})
    disputeDuration!: number | undefined | null

    @Column_("int4", {nullable: true})
    gracePeriod!: number | undefined | null

    @Column_("int4", {nullable: true})
    oracleDuration!: number | undefined | null

    @Index_()
    @Column_("text", {nullable: true})
    disputeMechanism!: string | undefined | null

    @Index_()
    @Column_("text", {nullable: true})
    marketType!: string | undefined | null

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    oracle!: Account

    @Column_("text", {array: true, nullable: true})
    spotPrices!: (string)[] | undefined | null

    @Column_("text", {nullable: true})
    swapFee!: string | undefined | null
}
