import { Module, forwardRef } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { CookieService } from "./cookie.service";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { OptionalJwtAuthGuard } from "./guards/optional-jwt-auth.guard";
import { UserModule } from "../user/user.module";
import { MailModule } from "../mail/mail.module";
import { PrismaModule } from "../../prisma/prisma.module";
import { RolesGuard } from "./guards/roles.guard";
import { RegistrationService } from "./registration.service";

@Module({
  imports: [forwardRef(() => UserModule), MailModule, PrismaModule],
  controllers: [AuthController],
  providers: [
    CookieService,
    RegistrationService,
    JwtAuthGuard,
    OptionalJwtAuthGuard,
    RolesGuard,
  ],
  exports: [CookieService, JwtAuthGuard, OptionalJwtAuthGuard, RolesGuard],
})
export class AuthModule {}
