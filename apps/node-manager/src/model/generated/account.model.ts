import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_} from "typeorm"
import {Node} from "./node.model"
import {Reward} from "./reward.model"

@Entity_()
export class Account {
    constructor(props?: Partial<Account>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @OneToMany_(() => Node, e => e.owner)
    nodes!: Node[]

    @OneToMany_(() => Reward, e => e.owner)
    rewards!: Reward[]
}
