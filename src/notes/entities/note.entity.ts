import { Column, Table, Model, AllowNull } from "sequelize-typescript";

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

  @AllowNull(false)
  @Column
  author: number;
}
