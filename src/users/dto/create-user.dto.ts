import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const createUserSchema = z
  .object({
    nickname: z.string(),
    username: z.string(),
    password: z.string(),
    email: z.string().email(),
  })
  .required();

export class CreateUserDto extends createZodDto(createUserSchema) {}
