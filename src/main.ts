import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { patchNestJsSwagger } from "nestjs-zod";
import { json } from 'express';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  patchNestJsSwagger();

  app.enableCors();
  app.use(json({ limit: '50mb' }));

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle("Noted API")
    .setDescription("The noted API description")
    .setVersion("1.0")
    .addTag("noted")
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
