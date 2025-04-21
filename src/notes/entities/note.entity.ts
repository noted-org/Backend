import { Column, Table, Model, AllowNull, ForeignKey, BelongsToMany } from "sequelize-typescript";
import { User } from "src/users/entities/user.entity";
import { Tag } from "../../tags/entities/tag.entity";
import { NoteTag } from "./noteTag.entity";

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

  @BelongsToMany(() => Tag, () => NoteTag)
  tags: Tag[];
}
