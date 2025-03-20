import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const createNoteSchema = z
  .object({
    name: z.string().nonempty(),
    content: z.string(),
  })
  .required();

export class CreateNoteDto extends createZodDto(createNoteSchema) {}
