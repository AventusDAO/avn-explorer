import {
  Entity as Entity_,
  Column as Column_,
  PrimaryGeneratedColumn as PrimaryColumn_,
  Index as Index_,
  ManyToOne as ManyToOne_
} from 'typeorm'
import { ObjectType, Field, ID, } from 'type-graphql';
import * as marshal from './marshal'
import { Account } from './account.model'
import { Token } from './token.model'

@ObjectType()
@Entity_()
export class TokenTransfer {
  constructor(props?: Partial<TokenTransfer>) {
    Object.assign(this, props)
  }

  @Field(() => String)
  @PrimaryColumn_()
  id!: string

  @Index_()
  @Field(() => BigInt, { nullable: true })
  @Column_('int4', { nullable: false })
  blockNumber!: number

  @Index_()
  @Field(() => Date)
  @Column_('timestamp with time zone', { nullable: false })
  timestamp!: Date

  @Index_()
  @Field(() => String, { nullable: true })
  @Column_('text', { nullable: true })
  extrinsicHash!: string | undefined | null

  @Index_()
  @Field(() => Account, { nullable: true })
  @ManyToOne_(() => Account, { nullable: true })
  from!: Account

  @Index_()
  @Field(() => Account, { nullable: true })
  @ManyToOne_(() => Account, { nullable: true })
  to!: Account

  @Index_()
  @Field(() => Account, { nullable: true })
  @ManyToOne_(() => Account, { nullable: true })
  relayer!: Account

  @Index_()
  @Field(() => Account, { nullable: true })
  @ManyToOne_(() => Account, { nullable: true })
  payer!: Account

  @Index_()
  @Field(() => BigInt)
  @Column_('numeric', { transformer: marshal.bigintTransformer, nullable: true })
  nonce!: bigint

  @Index_()
  @Field(() => BigInt)
  @Column_('numeric', { transformer: marshal.bigintTransformer, nullable: false })
  amount!: bigint

  @Index_()
  @Field(() => Token)
  @ManyToOne_(() => Token, { nullable: true })
  token!: Token

  @Index_()
  @Field(() => String)
  @Column_('text', { nullable: false })
  pallet!: string

  @Index_()
  @Field(() => String)
  @Column_('text', { nullable: false })
  method!: string

  @Field(() => String, { nullable: true })
  @Column_('text', { nullable: true })
  scheduleName!: string

  @Field(() => BigInt, { nullable: true })
  @Column_('numeric', { nullable: true })
  senderNonce!: bigint

  @Field(() => String, { nullable: true })
  @Column_('text', { nullable: true })
  t1Recipient!: string

  @Field(() => BigInt, { nullable: true })
  @Column_('int4', { nullable: true })
  lowerId!: number
}