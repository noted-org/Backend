import { z } from "zod";
import { createUserSchema } from "./create-user.dto";
import { createZodDto } from "nestjs-zod";

export const updateUserSchema = createUserSchema.extend({
  username: z.string().optional(),
  nickname: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().optional(),
});

export class UpdateUserDto extends createZodDto(updateUserSchema) {}
