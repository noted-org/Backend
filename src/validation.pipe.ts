import { PipeTransform, BadRequestException } from "@nestjs/common";
import { ZodSchema } from "zod";

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      const parsedValue = this.schema.parse(value) as unknown;
      return parsedValue;
    } catch (error) {
      throw new BadRequestException("Validation failed: " + error);
    }
  }
}
