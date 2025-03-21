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
import { UsersService } from "./users.service";
import { CreateUserDto, createUserSchema } from "./dto/create-user.dto";
import { UpdateUserDto, updateUserSchema } from "./dto/update-user.dto";
import { ZodValidationPipe } from "src/validation.pipe";
import { UniqueConstraintError } from "sequelize";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AuthIdGuard, AuthUsernameGuard } from "src/auth.guard";
import { sha512 } from "js-sha512";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(createUserSchema)) createUserDto: CreateUserDto,
  ) {
    createUserDto.password = sha512(createUserDto.password);
    return this.usersService.create(createUserDto).catch((err) => {
      if (err.name === "SequelizeUniqueConstraintError") {
        throw new ConflictException("Username already exists");
      } else {
        throw err;
      }
    });
  }

  @ApiBearerAuth()
  @Get("auth")
  @UseGuards(AuthUsernameGuard)
  auth(@Req() request: Request) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return request["user"];
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number) {
    const answ = await this.usersService.findOne(id);

    if (answ) {
      return answ;
    }

    throw new NotFoundException();
  }

  @ApiBearerAuth()
  @Patch(":id")
  @UseGuards(AuthIdGuard)
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateUserSchema)) updateUserDto: UpdateUserDto,
    @Req() request: Request,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (id !== request["user"]?.id) {
      throw new ForbiddenException(
        "You are only allowed to update your own user",
      );
    }

    const count = await this.usersService
      .update(id, updateUserDto)
      .catch((err) => {
        if (err.name === "SequelizeUniqueConstraintError") {
          throw new ConflictException("Username already exists");
        } else {
          throw err;
        }
      });

    if (count[0] === 1) {
      return this.usersService.findOne(id);
    }

    throw new NotFoundException("The user was not found");
  }

  @ApiBearerAuth()
  @Delete(":id")
  @UseGuards(AuthIdGuard)
  async remove(@Param("id", ParseIntPipe) id: number, @Req() request: Request) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (id !== request["user"]?.id) {
      throw new ForbiddenException(
        "You are only allowed to delete your own user",
      );
    }

    const ret = await this.usersService.remove(id);

    if (ret === 1) {
      return;
    }

    throw new NotFoundException("User with this id does not exist");
  }
}
