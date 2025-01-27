import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_} from "typeorm"
import * as marshal from "./marshal"
import {Account} from "./account.model"

@Entity_()
export class PredictionMarketAssetTransfer {
    constructor(props?: Partial<PredictionMarketAssetTransfer>) {
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
    @ManyToOne_(() => Account, {nullable: true})
    to!: Account

    @Index_()
    @Column_("text", {nullable: true})
    token!: string | undefined | null

    @Index_()
    @Column_("text", {nullable: true})
    kind!: string | undefined | null
}
