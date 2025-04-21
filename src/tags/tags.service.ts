import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Tag } from "./entities/tag.entity";
import { CreateTagDto } from "./dto/create-tag.dto";

@Injectable()
export class TagsService {
  constructor(
    @InjectModel(Tag)
    private tagRepository: typeof Tag,
  ) {}

  create(createUserDto: CreateTagDto, userId: number) {
    return this.tagRepository.create({
      ...(createUserDto as any),
      userId: userId,
    });
  }

  findAll(userId: number) {
    return this.tagRepository.findAll({ where: { userId: userId } });
  }

  findOne(id: number) {
    return this.tagRepository.findOne({ where: { id: id } });
  }

  remove(id: number) {
    return this.tagRepository.destroy({
      where: {
        id: id,
      },
    });
  }
}
