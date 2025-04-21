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
import { AuthIdGuard } from "src/auth.guard";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller("tags")
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @ApiBearerAuth()
  @Post()
  @UseGuards(AuthIdGuard)
  create(
    @Body(new ZodValidationPipe(createTagSchema)) createTagDto: CreateTagDto,
    @Req() request: Request,
  ) {
    return this.tagsService.create(createTagDto, request["user"]?.id).catch((err) => {
      if (err.name === "SequelizeUniqueConstraintError") {
        throw new ConflictException("Tag already exists");
      } else {
        throw err;
      }
    });
  }

  @ApiBearerAuth()
  @Get()
  @UseGuards(AuthIdGuard)
  findAll(
    @Req() request: Request,
  ) {
    return this.tagsService.findAll(request["user"]?.id);
  }

  @ApiBearerAuth()
  @Delete(":id")
  @UseGuards(AuthIdGuard)
  async remove(
    @Param("id", ParseIntPipe) id: number,
    @Req() request: Request,
  ) {
    const tag = await this.tagsService.findOne(id);

    if (!tag) {
      throw new NotFoundException("Tag with this id does not exist");
    }

    if (tag.userId !== request["user"]?.id) {
      throw new ForbiddenException("You cannot delete tags from other users");
    }

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
