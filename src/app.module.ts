import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { dataBaseConfig } from "./database/database.config";
import { SequelizeModule } from "@nestjs/sequelize";
import { NotesModule } from "./notes/notes.module";
import { TagsModule } from "./tags/tags.module";

@Module({
  imports: [UsersModule, NotesModule, SequelizeModule.forRoot(dataBaseConfig), TagsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
