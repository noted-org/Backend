import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const authUserSchema = z
  .object({
    username: z.string(),
    password: z.string(),
  })
  .required();

export class AuthUserDto extends createZodDto(authUserSchema) {}
