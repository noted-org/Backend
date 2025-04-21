import { Injectable, NotFoundException } from "@nestjs/common";
import { Note } from "./entities/note.entity";
import { InjectModel } from "@nestjs/sequelize";
import { CreateNoteDto } from "./dto/create-note.dto";
import { UpdateNoteDto } from "./dto/update-note.dto";
import { Tag } from "../tags/entities/tag.entity";

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Note)
    private noteRepository: typeof Note,
    @InjectModel(Tag)
    private tagRepository: typeof Tag,
  ) {}

  async create(createNoteDto: CreateNoteDto, authorId: number) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const note = await this.noteRepository.create({
      ...(createNoteDto as any),
      author: authorId,
    });

    if (createNoteDto.tags) {
      await this.addTags(note.id, createNoteDto.tags);
    }

    return note;
  }

  findAll() {
    return this.noteRepository.findAll({
      include: [{
        model: Tag,
        attributes: ["id", "name"],
        through: {attributes: []},
      }],
    });
  }

  findOne(id: number) {
    return this.noteRepository.findOne({
      where: {
        id: id,
      },
      include: [{ model: Tag }],
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

  addTags(noteId: number, tags: number[]) {
    const tagRequests = tags.map((tagId) => {
      return this.tagRepository.findOne({
        where: {
          id: tagId,
        },
      })
    })

    const instances = Promise.all(tagRequests)

    return this.noteRepository.findOne({
      where: {
        id: noteId,
      },
    }).then((note) => {
      if (!note) {
        throw new NotFoundException("Note not found");
      }

      return instances.then((tags) => {
        tags.forEach((tag) => {
          if (!tag) {
            throw new NotFoundException("Tag not found");
          }
          note.$add("tags", tag);
        })
        return note.save();
      })
    })
  }

  async removeTag(noteId: number, tagId: number) {
    const tag = await this.tagRepository.findOne({
      where: {
        id: tagId,
      }
    })
    const note = await this.noteRepository.findOne({
      where: {
        id: noteId,
      }
    })

    if (!note || !tag) {
      throw new NotFoundException("Note or tag not found");
    }

    note.$remove("tags", tag)
    note.save()
  }
}
