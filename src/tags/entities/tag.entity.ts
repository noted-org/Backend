import { Column, Table, Model, AllowNull, Unique } from "sequelize-typescript";

@Table({
  tableName: "tag",
})
export class Tag extends Model {
  @AllowNull(false)
  @Unique
  @Column
  name: string;
}