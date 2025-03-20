import { z } from "zod";
import { createUserSchema } from "./create-user.dto";
import { createZodDto } from "nestjs-zod";

export const updateUserSchema = createUserSchema.extend({
  username: z
    .string()
    .nonempty()
    .regex(/^\S*$/, {
      message: "Username must not contain whitespace",
    })
    .optional(),
  password: z
    .string()
    .regex(/^[a-f0-9]{128}$/i, {
      message: "Invalid password SHA-512 hash",
    })
    .optional(),
  nickname: z.string().optional(),
  email: z.string().email().optional(),
});

export class UpdateUserDto extends createZodDto(updateUserSchema) {}
