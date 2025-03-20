import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { UsersService } from "./users/users.service";
import { sha512 } from "js-sha512";

@Injectable()
export class AuthIdGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing or invalid Bearer token");
    }

    const username = authHeader.split(" ")[1];
    const password = authHeader.split(" ")[2];

    try {
      console.log("password and id: " + password + " " + username);

      const user = await this.usersService.findOneByUsername(username);
      console.log(JSON.stringify(user) + " " + sha512(password));
      console.log(user?.dataValues?.password)
      console.log(sha512(password))
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (user?.dataValues?.password !== sha512(password)) {
        throw new ForbiddenException("Wrong credentials");
      }

      request["user"] = user;

      return true;
    } catch (error) {
      if (
        error instanceof ForbiddenException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      console.error(error);
      throw new UnauthorizedException("Invalid token");
    }
  }
}
