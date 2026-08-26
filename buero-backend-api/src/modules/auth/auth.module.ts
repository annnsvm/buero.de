import { Module, forwardRef } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { CookieService } from "./cookie.service";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { OptionalJwtAuthGuard } from "./guards/optional-jwt-auth.guard";
import { UserModule } from "../user/user.module";
import { RolesGuard } from "./guards/roles.guard";

@Module({
  imports: [forwardRef(() => UserModule)],
  controllers: [AuthController],
  providers: [CookieService, JwtAuthGuard, OptionalJwtAuthGuard, RolesGuard],
  exports: [CookieService, JwtAuthGuard, OptionalJwtAuthGuard, RolesGuard],
})
export class AuthModule {}
