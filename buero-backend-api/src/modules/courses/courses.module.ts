import { Module } from "@nestjs/common";
import { CloudinaryModule } from "../../cloudinary/cloudinary.module";
import { PrismaModule } from "../../prisma/prisma.module";
import { AuthModule } from "../auth/auth.module";
import { UserModule } from "../user/user.module";
import { CourseService } from "./course.service";
import { CoursesController } from "./courses.controller";

@Module({
  imports: [PrismaModule, AuthModule, UserModule, CloudinaryModule],
  controllers: [CoursesController],
  providers: [CourseService],
  exports: [CourseService],
})
export class CoursesModule {}
