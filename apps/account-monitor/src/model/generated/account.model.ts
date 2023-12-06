import {
  Entity as Entity_,
  Column as Column_,
  PrimaryColumn as PrimaryColumn_,
  Index as Index_,
  OneToMany as OneToMany_
} from 'typeorm'
import { ObjectType, Field, ID } from 'type-graphql';
import * as marshal from './marshal'
import { AccountToken } from './accountToken.model'
import { AccountNft } from './accountNft.model'

@ObjectType()
@Entity_()
export class Account {
  constructor(props?: Partial<Account>) {
    Object.assign(this, props)
  }

  @Field(() => String)
  @PrimaryColumn_()
  id!: string

  @Index_()
  @Field(() => BigInt)
  @Column_('numeric', { transformer: marshal.bigintTransformer, nullable: false })
  avtBalance!: bigint

  @Field(() => [AccountToken])
  @OneToMany_(() => AccountToken, e => e.account)
  tokens!: Promise<AccountToken[]>

  @OneToMany_(() => AccountNft, e => e.account)
  nfts!: Promise<AccountNft[]>
}
