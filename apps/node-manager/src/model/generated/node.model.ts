import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import {Account} from "./account.model"
import {Reward} from "./reward.model"

@Entity_()
export class Node {
    constructor(props?: Partial<Node>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    owner!: Account

    @OneToMany_(() => Reward, e => e.node)
    rewards!: Reward[]

    @Column_("timestamp with time zone", {nullable: false})
    blockTimestamp!: Date

    @Column_("bool", {nullable: false, default: true})
    registered!: boolean
}
