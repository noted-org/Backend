import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { Note } from 'src/notes/entities/note.entity';
import { NoteTag } from 'src/notes/entities/noteTag.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { User } from 'src/users/entities/user.entity';

export const dataBaseConfig: SequelizeModuleOptions = {
  dialect: 'sqlite',
  storage: '.db/data.sqlite3',
  autoLoadModels: true,
  synchronize: true,
  models: [NoteTag, Tag, User, Note],
};
