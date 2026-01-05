import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"

@Entity_()
export class TokenExample {
    constructor(props?: Partial<TokenExample>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string
}
