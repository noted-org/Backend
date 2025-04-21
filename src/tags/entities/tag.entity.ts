import { Column, Table, Model, AllowNull, Unique, ForeignKey } from "sequelize-typescript";
import { User } from "src/users/entities/user.entity";

@Table({
  tableName: "tag",
})
export class Tag extends Model {
  @AllowNull(false)
  @Unique
  @Column
  name: string;

  @ForeignKey(() => User)
  @Column({
    onDelete: "CASCADE",
  })
  userId: number;
}