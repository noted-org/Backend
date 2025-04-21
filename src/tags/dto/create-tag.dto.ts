import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const createTagSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
  })
  .required();

export class CreateTagDto extends createZodDto(createTagSchema) {}
