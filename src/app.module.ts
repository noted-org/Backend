import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { dataBaseConfig } from "./database/database.config";
import { SequelizeModule } from "@nestjs/sequelize";

@Module({
  imports: [UsersModule, SequelizeModule.forRoot(dataBaseConfig)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
