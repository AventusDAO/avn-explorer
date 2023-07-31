import {
  Entity as Entity_,
  Column as Column_,
  PrimaryGeneratedColumn as PrimaryGeneratedColumn_,
  PrimaryColumn as PrimaryColumn_,
  ManyToOne as ManyToOne_,
  Index as Index_,
  JoinColumn as JoinColumn_
} from 'typeorm'
import * as marshal from './marshal'
import { Account } from './account.model'
import { Token } from './token.model'

@Entity_()
export class AccountToken {
  constructor(props?: Partial<AccountToken>) {
    Object.assign(this, props)
  }

  @PrimaryGeneratedColumn_()
  id!: string

  @Column_('text', { nullable: true })
  accountId!: string

  @Column_('text', { nullable: true })
  tokenId!: string

  @Index_()
  @ManyToOne_(() => Account, { nullable: true })
  @JoinColumn_({ name: 'accountId' })
  account!: Account

  @Index_()
  @ManyToOne_(() => Token, { nullable: true })
  @JoinColumn_({ name: 'tokenId' })
  token!: Token

  @Index_()
  @Column_('numeric', { transformer: marshal.bigintTransformer, nullable: true })
  balance!: bigint
}
