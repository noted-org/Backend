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
  UseGuards,
  Req,
  ForbiddenException,
} from "@nestjs/common";
import { ZodValidationPipe } from "src/validation.pipe";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AuthIdGuard } from "src/auth.guard";
import { CreateNoteDto, createNoteSchema } from "./dto/create-note.dto";
import { NotesService } from "./notes.service";
import { UpdateNoteDto, updateNoteSchema } from "./dto/update-note.dto";

@Controller("notes")
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  findAll() {
    return this.notesService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number) {
    const answ = await this.notesService.findOne(id);

    if (answ) {
      return answ;
    }

    throw new NotFoundException();
  }

  @ApiBearerAuth()
  @Post()
  @UseGuards(AuthIdGuard)
  create(
    @Body(new ZodValidationPipe(createNoteSchema)) createNoteDto: CreateNoteDto,
    @Req() request: Request,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.notesService.create(createNoteDto, request["user"]?.id);
  }

  @ApiBearerAuth()
  @Patch(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateNoteSchema)) updateNoteDto: UpdateNoteDto,
    @Req() request: Request,
  ) {
    const note = await this.notesService.findOne(id);

    if (!note) {
      throw new NotFoundException("Note with this id does not exist");
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (note.author !== request["user"]?.id) {
      throw new ForbiddenException("Your cannot edit notes from other users");
    }

    const count = await this.notesService.update(id, updateNoteDto);

    if (count[0] === 1) {
      return this.notesService.findOne(id);
    }

    throw new NotFoundException("The note was not found");
  }

  @ApiBearerAuth()
  @Delete(":id")
  @UseGuards(AuthIdGuard)
  async remove(@Param("id", ParseIntPipe) id: number, @Req() request: Request) {
    const note = await this.notesService.findOne(id);

    if (!note) {
      throw new NotFoundException("Note with this id does not exist");
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (note?.dataValues?.author !== request["user"]?.id) {
      throw new ForbiddenException("Your cannot delete notes from other users");
    }

    const ret = await this.notesService.remove(id);

    if (ret === 1) {
      return;
    }

    throw new NotFoundException("Note with this id does not exist");
  }
}
