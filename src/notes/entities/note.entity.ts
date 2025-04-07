import { Column, Table, Model, AllowNull, ForeignKey } from "sequelize-typescript";
import { User } from "src/users/entities/user.entity";

@Table({
  tableName: "note",
})
export class Note extends Model {
  @AllowNull(false)
  @Column
  name: string;

  @AllowNull(false)
  @Column
  content: string;

  @ForeignKey(() => User)
  @Column
  author: number;
}
