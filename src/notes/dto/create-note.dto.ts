import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const createNoteSchema = z
  .object({
    name: z.string().nonempty(),
    content: z.string(),
    tags: z.array(z.number()).optional(),
  })
  .required();

export class CreateNoteDto extends createZodDto(createNoteSchema) {}
