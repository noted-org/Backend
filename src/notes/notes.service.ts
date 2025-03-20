import { Injectable } from "@nestjs/common";
import { Note } from "./entities/note.entity";
import { InjectModel } from "@nestjs/sequelize";
import { CreateNoteDto } from "./dto/create-note.dto";
import { UpdateNoteDto } from "./dto/update-note.dto";

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Note)
    private noteRepository: typeof Note,
  ) {}

  create(createNoteDto: CreateNoteDto, authorId: number) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.noteRepository.create({
      ...(createNoteDto as any),
      author: authorId,
    });
  }

  findAll() {
    return this.noteRepository.findAll();
  }

  findOne(id: number) {
    return this.noteRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  update(id: number, updateNoteDto: UpdateNoteDto) {
    return this.noteRepository.update(updateNoteDto, {
      where: {
        id: id,
      },
    });
  }

  remove(id: number) {
    return this.noteRepository.destroy({
      where: {
        id: id,
      },
    });
  }
}
