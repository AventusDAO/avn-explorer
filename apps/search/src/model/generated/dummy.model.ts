import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"

@Entity_()
export class Dummy {
  constructor(props?: Partial<Dummy>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string
}
