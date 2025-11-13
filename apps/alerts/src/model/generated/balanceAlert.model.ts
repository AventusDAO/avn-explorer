import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_} from "typeorm"
import {BalanceConfig} from "./balanceConfig.model"

@Entity_()
export class BalanceAlert {
    constructor(props?: Partial<BalanceAlert>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("text", {nullable: false})
    accountAddress!: string

    @Index_()
    @Column_("text", {nullable: false})
    alertType!: string

    @Column_("text", {nullable: false})
    threshold!: string

    @Column_("text", {nullable: false})
    actualBalance!: string

    @Index_()
    @Column_("int4", {nullable: false})
    blockNumber!: number

    @Index_()
    @Column_("timestamp with time zone", {nullable: false})
    timestamp!: Date

    @Index_()
    @ManyToOne_(() => BalanceConfig, {nullable: true})
    config!: BalanceConfig

    @Column_("timestamp with time zone", {nullable: false})
    createdAt!: Date
}
