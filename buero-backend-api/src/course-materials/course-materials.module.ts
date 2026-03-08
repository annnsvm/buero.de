import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CourseMaterialService } from './course-material.service';
import { CourseMaterialsController } from './course-materials.controller';

@Module({
  imports: [PrismaModule],
  controllers: [CourseMaterialsController],
  providers: [CourseMaterialService],
  exports: [CourseMaterialService],
})
export class CourseMaterialsModule {}
