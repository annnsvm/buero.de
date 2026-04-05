import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { LessonRequestService } from "./lesson-request.service";
import { LessonRequestsController } from "./lesson-requests.controller";

@Module({
  imports: [PrismaModule],
  controllers: [LessonRequestsController],
  providers: [LessonRequestService],
  exports: [LessonRequestService],
})
export class LessonRequestsModule {}
