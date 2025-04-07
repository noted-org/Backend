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

  create(createUserDto: CreateTagDto) {
    return this.tagRepository.create(createUserDto as any);
  }

  findAll() {
    return this.tagRepository.findAll();
  }

  remove(id: number) {
    return this.tagRepository.destroy({
      where: {
        id: id,
      },
    });
  }
}
