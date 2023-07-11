import {
  Entity as Entity_,
  Column as Column_,
  PrimaryColumn as PrimaryColumn_,
  Index as Index_,
  OneToMany as OneToMany_
} from 'typeorm'
import * as marshal from './marshal'
import { AccountToken } from './accountToken.model'
import { AccountNft } from './accountNft.model'

@Entity_()
export class Account {
  constructor(props?: Partial<Account>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @Column_('numeric', { transformer: marshal.bigintTransformer, nullable: false })
  avtBalance!: bigint

  @OneToMany_(() => AccountToken, e => e.account)
  tokens!: Promise<AccountToken[]>

  @OneToMany_(() => AccountNft, e => e.account)
  nfts!: Promise<AccountNft[]>
}
