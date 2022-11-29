import {
  Entity as Entity_,
  Column as Column_,
  PrimaryColumn as PrimaryColumn_,
  ManyToOne as ManyToOne_,
  Index as Index_
} from 'typeorm'
import * as marshal from '../generated/marshal'
import { Token } from '../generated/token.model'

@Entity_()
export class TokenBalance {
  constructor(props?: Partial<TokenBalance>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: false,
    precision: 80,
    scale: 0
  })
  amount!: bigint

  @Index_()
  @ManyToOne_(() => Token, { nullable: true })
  token!: Token
}
