import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { InjectModel } from "@nestjs/sequelize";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userRepository: typeof User,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.userRepository.create(createUserDto as any);
  }

  findAll() {
    return this.userRepository.findAll({
      attributes: {
        exclude: ["password", "profilePicture"],
      },
    });
  }

  findOne(id: number) {
    return this.userRepository.findOne({
      where: {
        id: id,
      },
      attributes: {
        exclude: ["profilePicture"],
      },
    });
  }

  getProfilePicture(id: number) {
    return this.userRepository.findOne({
      where: {
        id: id,
      },
      attributes: ["profilePicture"],
    });
  }

  findOneByUsername(username: string) {
    return this.userRepository.findOne({
      where: {
        username: username,
      },
      attributes: {
        exclude: ["profilePicture"],
      },
    });
  }
  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(updateUserDto, {
      where: {
        id: id,
      },
    });
  }

  remove(id: number) {
    return this.userRepository.destroy({
      where: {
        id: id,
      },
    });
  }
}
