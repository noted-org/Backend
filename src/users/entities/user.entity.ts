import { Column, Table, Model, IsEmail, AllowNull, Unique, HasMany } from "sequelize-typescript";
import { Note } from "src/notes/entities/note.entity";

@Table({
  tableName: "users",
})
export class User extends Model {
  @AllowNull(false)
  @Column
  nickname: string;

  @AllowNull(false)
  @Unique
  @Column
  username: string;

  @AllowNull(false)
  @Column
  password: string;

  @IsEmail
  @AllowNull(false)
  @Column
  email: string;

  @Column
  profilePicture?: string;

  @HasMany(() => Note, { onDelete: "CASCADE" })
  notes: Note[];
}
