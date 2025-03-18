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

    const token = authHeader.split(" ")[1];

    try {
      let requestedId = 0;
      try {
        requestedId = parseInt(request.params.id);
      } catch {
        throw new BadRequestException("User id has to be a number");
      }
      console.log("password and id: " + token + " " + requestedId);

      const user = await this.usersService.findOne(requestedId);

      if (user?.dataValues?.password !== sha512(token)) {
        throw new ForbiddenException(
          "You are not allowed to access this resource",
        );
      }

      request["user"] = user;

      return true;
    } catch {
      throw new UnauthorizedException("Invalid token");
    }
  }
}
