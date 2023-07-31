import {
  Entity as Entity_,
  Column as Column_,
  PrimaryColumn as PrimaryColumn_,
  OneToMany as OneToMany_
} from 'typeorm'
import { AccountNft } from './accountNft.model'

@Entity_()
export class Nft {
  constructor(props?: Partial<Nft>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_('int4', { nullable: false, default: 0 })
  totalSupply!: number

  @OneToMany_(() => AccountNft, e => e.nft)
  accounts!: Promise<AccountNft[]>
}
