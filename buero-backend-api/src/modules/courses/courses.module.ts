import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { CourseService } from './course.service';
import { CoursesController } from './courses.controller';

@Module({
  imports: [PrismaModule],
  controllers: [CoursesController],
  providers: [CourseService],
  exports: [CourseService],
})
export class CoursesModule {}
