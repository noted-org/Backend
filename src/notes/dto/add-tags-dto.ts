import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const addTagsSchema = z
  .object({
    tags: z.array(z.number()).nonempty(),
  })
  .required();

export class AddTagsDto extends createZodDto(addTagsSchema) {}