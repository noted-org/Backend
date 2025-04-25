import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const base64ImageRegex = /^data:image\/(png|jpeg);base64,[A-Za-z0-9+/=]+$/;

export const base64ImageSchema = z.string().regex(
  base64ImageRegex,
  'Invalid base64 image format. Must be a PNG or JPEG image in data URI format.'
);

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
    profilePicture: base64ImageSchema.optional(),
  });

export class CreateUserDto extends createZodDto(createUserSchema) {}
