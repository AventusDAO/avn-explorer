import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_} from "typeorm"
import {EventConfig} from "./eventConfig.model"

@Entity_()
export class EventOccurrence {
    constructor(props?: Partial<EventOccurrence>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("text", {nullable: false})
    eventName!: string

    @Index_()
    @Column_("int4", {nullable: false})
    blockNumber!: number

    @Index_()
    @Column_("timestamp with time zone", {nullable: false})
    timestamp!: Date

    @Index_()
    @Column_("text", {nullable: true})
    extrinsicHash!: string | undefined | null

    @Column_("int4", {nullable: false})
    eventIndex!: number

    @Index_()
    @Column_("text", {nullable: false})
    section!: string

    @Index_()
    @Column_("text", {nullable: false})
    method!: string

    @Column_("text", {nullable: true})
    metadata!: string | undefined | null

    @Column_("text", {nullable: false})
    args!: string

    @Index_()
    @ManyToOne_(() => EventConfig, {nullable: true})
    config!: EventConfig

    @Column_("timestamp with time zone", {nullable: false})
    createdAt!: Date
}
