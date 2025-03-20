import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const createUserSchema = z
  .object({
    nickname: z.string(),
    username: z.string().nonempty().regex(/^\S*$/, {
      message: "Username must not contain whitespace",
    }),
    password: z.string().regex(/^[a-f0-9]{128}$/i, {
      message: "Invalid password SHA-512 hash",
    }),
    email: z.string().email(),
  })
  .required();

export class CreateUserDto extends createZodDto(createUserSchema) {}
