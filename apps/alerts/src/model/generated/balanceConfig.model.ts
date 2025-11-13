import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"

@Entity_()
export class BalanceConfig {
    constructor(props?: Partial<BalanceConfig>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("text", {nullable: false})
    accountAddress!: string

    @Column_("text", {nullable: false})
    prometheusTags!: string

    @Column_("text", {nullable: false})
    warningThreshold!: string

    @Column_("text", {nullable: false})
    dangerThreshold!: string

    @Column_("timestamp with time zone", {nullable: false})
    createdAt!: Date

    @Column_("timestamp with time zone", {nullable: false})
    updatedAt!: Date
}
