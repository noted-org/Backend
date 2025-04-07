import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { NotesController } from "./notes.controller";
import { NotesService } from "./notes.service";
import { Note } from "./entities/note.entity";
import { UsersService } from "src/users/users.service";
import { User } from "src/users/entities/user.entity";
import { Tag } from "../tags/entities/tag.entity";

@Module({
  imports: [
    SequelizeModule.forFeature([Note]),
    SequelizeModule.forFeature([User]),
    SequelizeModule.forFeature([Tag]),
  ],
  controllers: [NotesController],
  providers: [NotesService, UsersService],
})
export class NotesModule {}
