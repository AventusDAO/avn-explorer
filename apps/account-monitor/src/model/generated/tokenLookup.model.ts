import {Entity as Entity_, Column as Column_, PrimaryGeneratedColumn as PrimaryColumn_, Index as Index_} from "typeorm"

@Entity_()
export class TokenLookup {
  constructor(props?: Partial<TokenLookup>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @Column_("text", {nullable: false})
  tokenId!: string

  @Index_()
  @Column_("text", {nullable: false})
  tokenName!: string
}
