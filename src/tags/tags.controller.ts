import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  NotFoundException,
  ConflictException,
  UseGuards,
  Req,
  ForbiddenException,
} from "@nestjs/common";
import { ZodValidationPipe } from "src/validation.pipe";
import { CreateTagDto, createTagSchema } from "./dto/create-tag.dto";
import { TagsService } from "./tags.service";

@Controller("tags")
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(createTagSchema)) createTagDto: CreateTagDto,
  ) {
    return this.tagsService.create(createTagDto).catch((err) => {
      if (err.name === "SequelizeUniqueConstraintError") {
        throw new ConflictException("Tag already exists");
      } else {
        throw err;
      }
    });
  }

  @Get()
  findAll() {
    return this.tagsService.findAll();
  }

  @Delete(":id")
  async remove(@Param("id", ParseIntPipe) id: number) {

    const ret = await this.tagsService.remove(id).catch((err) => {
      if (err.name === "SequelizeForeignKeyConstraintError") {
        throw new ConflictException("Cant delete tag, it is used in notes");
      } else {
        throw err;
      }
    });

    if (ret === 1) {
      return;
    }

    throw new NotFoundException("Tag with this id does not exist");
  }
}
