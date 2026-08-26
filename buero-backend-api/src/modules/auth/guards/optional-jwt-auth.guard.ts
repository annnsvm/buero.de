import { ExecutionContext, Injectable } from "@nestjs/common";
import { JwtAuthGuard } from "./jwt-auth.guard";

/**
 * Attaches `request.user` when a valid access token is present;
 * otherwise allows the request through as a guest (no 401).
 */
@Injectable()
export class OptionalJwtAuthGuard extends JwtAuthGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      return await super.canActivate(context);
    } catch {
      return true;
    }
  }
}
