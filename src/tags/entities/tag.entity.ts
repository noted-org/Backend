import { Column, Table, Model, AllowNull, Unique, ForeignKey } from "sequelize-typescript";
import { User } from "src/users/entities/user.entity";

@Table({
  tableName: "tag",
})
export class Tag extends Model {
  @AllowNull(false)
  @Unique("unique_tag_name")
  @Column
  name: string;

  @ForeignKey(() => User)
  @Unique("unique_tag_name")
  @Column({
    onDelete: "CASCADE",
  })
  userId: number;
}