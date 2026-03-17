import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserWithoutPassword } from "../../user/types/user-response.type";

/**
 * Отримати поточного користувача з request (після JwtAuthGuard).
 * Використання: @CurrentUser() user: UserWithoutPassword
 * або @CurrentUser('id') id: string
 */
export const CurrentUser = createParamDecorator(
  (data: keyof UserWithoutPassword | undefined, ctx: ExecutionContext): UserWithoutPassword | unknown => {
    const request = ctx.switchToHttp().getRequest<{ user?: UserWithoutPassword }>();
    const user = request.user;
    if (data && user) {
      return user[data];
    }
    return user;
  },
);
