import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { CourseModuleService } from './course-module.service';
import { CourseModulesController } from './course-modules.controller';

@Module({
  imports: [PrismaModule, AuthModule, UserModule],
  controllers: [CourseModulesController],
  providers: [CourseModuleService],
  exports: [CourseModuleService],
})
export class CourseModulesModule {}
