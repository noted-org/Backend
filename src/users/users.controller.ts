import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UsePipes,
  NotFoundException,
  ConflictException,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto, createUserSchema } from "./dto/create-user.dto";
import { UpdateUserDto, updateUserSchema } from "./dto/update-user.dto";
import { ZodValidationPipe } from "src/validation.pipe";
import { UniqueConstraintError } from "sequelize";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AuthIdGuard } from "src/auth.guard";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createUserSchema))
  create(@Body() createUserDto: CreateUserDto) {
    try {
      return this.usersService.create(createUserDto);
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new ConflictException("Username already exists");
      }
      throw error;
    }
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
  @UsePipes(new ZodValidationPipe(updateUserSchema))
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiBearerAuth()
  @Delete(":id")
  @UseGuards(AuthIdGuard)
  async remove(@Param("id", ParseIntPipe) id: number) {
    const ret = await this.usersService.remove(id);

    if (ret === 1) {
      return;
    }

    throw new NotFoundException("User with this id does not exist");
  }
}
