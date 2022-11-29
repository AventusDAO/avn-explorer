import {
  Entity as Entity_,
  Column as Column_,
  PrimaryColumn as PrimaryColumn_,
  ManyToOne as ManyToOne_,
  Index as Index_
} from 'typeorm'
import * as marshal from './marshal'

import { Account } from './account.model'
import { Token } from './token.model'

@Entity_()
export class TokenBalanceForAccount {
  constructor(props?: Partial<TokenBalanceForAccount>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_('numeric', { transformer: marshal.bigintTransformer, nullable: false })
  amount!: bigint

  @Index_()
  @ManyToOne_(() => Token, { nullable: true })
  token!: Token

  @Index_()
  @ManyToOne_(() => Account, { nullable: true })
  account!: Account
}
