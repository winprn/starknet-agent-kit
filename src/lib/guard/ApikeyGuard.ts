import { FastifyRequest } from "fastify";
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { Observable } from "rxjs";

const isValidApiKey = (apiKey: string): boolean => {
  return apiKey === "test";
};

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const apiKey = request.headers["x-api-key"] as string;

    if (!apiKey) {
      throw new BadRequestException("Api key missing");
    } else if (isValidApiKey(apiKey) === false) {
      throw new UnauthorizedException("Api key is not valid");
    }
    return true;
  }
}
