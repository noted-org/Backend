import { Column, Table, Model, ForeignKey } from "sequelize-typescript";
import { Note } from "./note.entity";
import { Tag } from "../../tags/entities/tag.entity";

@Table({
  tableName: "note_tag",
})
export class NoteTag extends Model {
  @ForeignKey(() => Note)
  @Column({
    onDelete: "CASCADE",
  })
  noteId: number;

  @ForeignKey(() => Tag)
  @Column({
    onDelete: "RESTRICT",
  })
  tagId: number;
}