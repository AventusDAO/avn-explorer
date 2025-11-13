import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_} from "typeorm"
import {BalanceConfig} from "./balanceConfig.model"

@Entity_()
export class BalanceState {
    constructor(props?: Partial<BalanceState>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_({unique: true})
    @Column_("text", {nullable: false})
    accountAddress!: string

    @Column_("int4", {nullable: false})
    lastCheckedBlock!: number

    @Column_("timestamp with time zone", {nullable: false})
    lastCheckedTimestamp!: Date

    @Column_("text", {nullable: false})
    currentBalance!: string

    @Column_("bool", {nullable: false})
    isWarning!: boolean

    @Column_("bool", {nullable: false})
    isDanger!: boolean

    @Index_()
    @ManyToOne_(() => BalanceConfig, {nullable: true})
    config!: BalanceConfig

    @Column_("timestamp with time zone", {nullable: false})
    updatedAt!: Date
}
