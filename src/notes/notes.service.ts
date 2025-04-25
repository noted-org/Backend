import { Injectable, NotFoundException } from "@nestjs/common";
import { Note } from "./entities/note.entity";
import { InjectModel } from "@nestjs/sequelize";
import { CreateNoteDto } from "./dto/create-note.dto";
import { UpdateNoteDto } from "./dto/update-note.dto";
import { Tag } from "../tags/entities/tag.entity";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import "dotenv/config";

const API_KEY=process.env.GOOGLE_AI_STUDIO_API_KEY;

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Note)
    private noteRepository: typeof Note,
    @InjectModel(Tag)
    private tagRepository: typeof Tag,
    private readonly httpService: HttpService,
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

  async summarizeNote(noteId: number) {
    const note = await this.noteRepository.findOne({
      where: {
        id: noteId,
      },
    });

    if (!note) {
      throw new NotFoundException("Note not found");
    }

    const response = await firstValueFrom(
      this.httpService.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          contents: [{
            parts: [{text: `Summarize the following note: ${note.dataValues.content}`}],
          }],
        },
      )
    )
    
    return response.data
  }
  
  async generateQuestions(noteId: number) {
    const note = await this.noteRepository.findOne({
      where: {
        id: noteId,
      },
    });

    if (!note) {
      throw new NotFoundException("Note not found");
    }

    const response = await firstValueFrom(
      this.httpService.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          contents: [{
            parts: [{text: `Generate some questions in the format "- [question]\n- [question]\n..."for the following note: ${note.dataValues.content}`}],
          }],
        },
      )
    )
    
    return response.data
  }
}