import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import type { StringValue } from "ms";
import { APP_GUARD } from "@nestjs/core";
import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";
import { StripeModule } from "./modules/stripe/stripe.module";
import { CoursesModule } from './modules/courses/courses.module';
import { CourseModulesModule } from './modules/course-modules/course-modules.module';
import { CourseMaterialsModule } from './modules/course-materials/course-materials.module';
import { HealthModule } from "./health/health.module";
import { PrismaModule } from "./prisma/prisma.module";
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { ProgressQuizModule } from './modules/progress-quiz/progress-quiz.module';
import { VocabularyModule } from './modules/vocabulary/vocabulary.module';
import { LessonRequestsModule } from './modules/lesson-requests/lesson-requests.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        const ttlSec = Number(config.get("THROTTLE_TTL")) || 60;
        const limit = Number(config.get("THROTTLE_LIMIT")) || 100;
        const e2e = config.get<string>("E2E_TEST") === "true";
        return {
          /** У e2e (`E2E_TEST=true`) не застосовувати rate limit (у т.ч. @Throttle на auth). */
          skipIf: () => e2e,
          throttlers: [
            { name: "default", ttl: ttlSec * 1000, limit },
          ],
        };
      },
      inject: [ConfigService],
    }),
    PrismaModule,
    StripeModule,
    HealthModule,
    CoursesModule,
    CourseModulesModule,
    CourseMaterialsModule,
    UserModule,
    AuthModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>("JWT_ACCESS_SECRET"),
        signOptions: {
          expiresIn: (config.get<string>("JWT_ACCESS_EXPIRES_IN") ??
            "30m") as StringValue,
        },
      }),
      inject: [ConfigService],
    }),
    SubscriptionsModule,
    ProgressQuizModule,
    VocabularyModule,
    LessonRequestsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

