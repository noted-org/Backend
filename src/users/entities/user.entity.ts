import { Column, Table, Model, IsEmail, AllowNull, Unique } from "sequelize-typescript";

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
}
