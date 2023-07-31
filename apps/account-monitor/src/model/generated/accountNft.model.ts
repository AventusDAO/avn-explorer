import {
  Entity as Entity_,
  Column as Column_,
  PrimaryGeneratedColumn as PrimaryGeneratedColumn_,
  PrimaryColumn as PrimaryColumn_,
  ManyToOne as ManyToOne_,
  Index as Index_,
  JoinColumn as JoinColumn_
} from 'typeorm'
import { Account } from './account.model'
import { Nft } from './nft.model'

@Entity_()
export class AccountNft {
  constructor(props?: Partial<AccountNft>) {
    Object.assign(this, props)
  }

  @PrimaryGeneratedColumn_()
  id!: string

  @Column_('text', { nullable: true })
  accountId!: string

  @Column_('text', { nullable: true })
  nftId!: string

  @Index_()
  @ManyToOne_(() => Account, { nullable: true })
  @JoinColumn_({ name: 'accountId' })
  account!: Account

  @Index_()
  @ManyToOne_(() => Nft, { nullable: true })
  @JoinColumn_({ name: 'nftId' })
  nft!: Nft | undefined | null
}
