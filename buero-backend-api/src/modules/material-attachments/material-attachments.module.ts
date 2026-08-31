import { Module } from "@nestjs/common";
import { CloudinaryModule } from "../../cloudinary/cloudinary.module";
import { PrismaModule } from "../../prisma/prisma.module";
import { AuthModule } from "../auth/auth.module";
import { CourseMaterialsModule } from "../course-materials/course-materials.module";
import { UserModule } from "../user/user.module";
import { MaterialAttachmentService } from "./material-attachment.service";
import { MaterialAttachmentsController } from "./material-attachments.controller";

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UserModule,
    CloudinaryModule,
    CourseMaterialsModule,
  ],
  controllers: [MaterialAttachmentsController],
  providers: [MaterialAttachmentService],
  exports: [MaterialAttachmentService],
})
export class MaterialAttachmentsModule {}
