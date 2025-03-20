import { z } from "zod";
import { createNoteSchema } from "./create-note.dto";
import { createZodDto } from "nestjs-zod";

export const updateNoteSchema = createNoteSchema.extend({
  name: z.string().nonempty().optional(),
  content: z.string().optional(),
});

export class UpdateNoteDto extends createZodDto(updateNoteSchema) {}
