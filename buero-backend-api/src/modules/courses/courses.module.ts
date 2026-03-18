import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { UserModule } from "../user/user.module";
import { PrismaModule } from "../../prisma/prisma.module";
import { CourseService } from "./course.service";
import { CoursesController } from "./courses.controller";

@Module({
  imports: [PrismaModule, AuthModule, UserModule],
  controllers: [CoursesController],
  providers: [CourseService],
  exports: [CourseService],
})
export class CoursesModule {}
