import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { LessonRequestsController } from './lesson-requests.controller';
import { LessonRequestService } from './lesson-request.service';

@Module({
  imports: [PrismaModule],
  controllers: [LessonRequestsController],
  providers: [LessonRequestService],
})
export class LessonRequestsModule {}
