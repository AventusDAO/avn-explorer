import {
  Entity as Entity_,
  Column as Column_,
  PrimaryColumn as PrimaryColumn_,
  OneToMany as OneToMany_
} from 'typeorm'
import { TokenBalance } from '../custom/tokenBalance.model'

@Entity_()
export class Token {
  constructor(props?: Partial<Token>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_('text', { nullable: false })
  name!: string

  @OneToMany_(() => TokenBalance, e => e.token)
  tokenBalances!: TokenBalance[]
}
