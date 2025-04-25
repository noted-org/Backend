import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Tag } from "./entities/tag.entity";
import { TagsController } from "./tags.controller";
import { TagsService } from "./tags.service";
import { UsersService } from "src/users/users.service";
import { User } from "src/users/entities/user.entity";

@Module({
  imports: [
    SequelizeModule.forFeature([Tag, User]),
  ],
  controllers: [TagsController],
  providers: [TagsService, UsersService],
})
export class TagsModule {}
