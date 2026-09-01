import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { UserService } from "../../user/user.service";
import type { Role } from "src/generated/prisma/enums";
import type { UserWithoutPassword } from "../../user/types/user-response.type";

type AccessPayload = {
  sub: string;
  role?: Role;
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.getToken(request);
    if (!token) throw new UnauthorizedException("No token provided");
    try {
      const secret = this.configService.get<string>("JWT_ACCESS_SECRET");
      const payload = this.jwtService.verify<AccessPayload>(token, { secret });
      if (!payload.sub) throw new UnauthorizedException("Invalid token");

      if (payload.role) {
        request.user = { id: payload.sub, role: payload.role } as UserWithoutPassword;
        return true;
      }

      const user = await this.userService.findUserById(payload.sub);
      if (!user) throw new UnauthorizedException("Invalid token");
      request.user = user;
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException("Invalid or expired token");
    }
  }

  private getToken(request: Request): string | null {
    const cookie = request.cookies?.access_token;
    if (cookie) return cookie;
    const auth = request.headers.authorization;
    if (auth?.startsWith("Bearer ")) return auth.slice(7);
    return null;
  }
}
