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
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService
    ) { }
    
    async canActivate(context: ExecutionContext): Promise<boolean> { 
        const request = context.switchToHttp().getRequest<Request>();
        const token = this.getToken(request);
        if (!token) throw new UnauthorizedException('No token provided');
        try {
            const secret = this.configService.get<string>('JWT_ACCESS_SECRET');
            const payload = this.jwtService.verify<{ sub: string }>(token, { secret });
            const user = await this.userService.findUserById(payload.sub);
            if (!user) throw new UnauthorizedException('Invalid token');

            request.user = user;
            return true;
            
        } catch {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }

    private getToken(request: Request): string | null {
        const cookie = request.cookies?.access_token;
        if (cookie) return cookie;
        const auth = request.headers.authorization;
        if (auth?.startsWith('Bearer ')) return auth.slice(7);
        return null;
     }
}
