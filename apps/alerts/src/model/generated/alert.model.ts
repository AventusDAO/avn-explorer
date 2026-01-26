import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"

@Entity_()
export class Alert {
    constructor(props?: Partial<Alert>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("text", {nullable: false})
    alertType!: string

    @Index_()
    @Column_("text", {nullable: false})
    sourceIdentifier!: string

    @Index_()
    @Column_("text", {nullable: false})
    alertMessage!: string

    @Index_()
    @Column_("bool", {nullable: false})
    isWarning!: boolean

    @Index_()
    @Column_("bool", {nullable: false})
    isError!: boolean

    @Index_()
    @Column_("timestamp with time zone", {nullable: false})
    expireAt!: Date

    @Column_("timestamp with time zone", {nullable: false})
    createdAt!: Date
}
