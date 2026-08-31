import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  StreamableFile,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Role } from "src/generated/prisma/enums";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import type { UserWithoutPassword } from "../user/types/user-response.type";
import { MulterExceptionFilter } from "../courses/filters/multer-exception.filter";
import { MaterialAttachmentService } from "./material-attachment.service";
import {
  CreateMaterialLinkAttachmentDto,
  UpdateMaterialAttachmentDto,
} from "./dto/material-attachment.dto";
import { materialAttachmentMulterOptions } from "./multer-material-attachment.config";

const contentDispositionAttachment = (fileName: string): string => {
  const fallback =
    fileName.replace(/[^\x20-\x7E]/g, "_").replace(/["\\]/g, "") || "attachment";
  return `attachment; filename="${fallback}"; filename*=UTF-8''${encodeURIComponent(fileName)}`;
};

@ApiTags("material-attachments")
@Controller(
  "courses/:courseId/modules/:moduleId/materials/:materialId/attachments",
)
export class MaterialAttachmentsController {
  constructor(
    private readonly materialAttachmentService: MaterialAttachmentService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access_token")
  @ApiOperation({
    summary: "List lesson attachments",
    description:
      "Attachments for a material, ordered by order_index. Teachers always; students need course access.",
  })
  @ApiParam({ name: "courseId", description: "Course UUID" })
  @ApiParam({ name: "moduleId", description: "Module UUID" })
  @ApiParam({ name: "materialId", description: "Material UUID" })
  @ApiResponse({ status: 200, description: "Attachment list" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "No access to this course" })
  @ApiResponse({ status: 404, description: "Course, module or material not found" })
  async list(
    @CurrentUser() user: UserWithoutPassword,
    @Param("courseId") courseId: string,
    @Param("moduleId") moduleId: string,
    @Param("materialId") materialId: string,
  ) {
    await this.materialAttachmentService.assertCanAccess(
      user.id,
      user.role,
      courseId,
      moduleId,
    );
    return this.materialAttachmentService.list(courseId, moduleId, materialId);
  }

  @Get(":attachmentId/download")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access_token")
  @ApiOperation({
    summary: "Download a file attachment",
    description:
      "Streams the file after the same course-access check as listing attachments. Link attachments cannot be downloaded this way.",
  })
  @ApiParam({ name: "courseId", description: "Course UUID" })
  @ApiParam({ name: "moduleId", description: "Module UUID" })
  @ApiParam({ name: "materialId", description: "Material UUID" })
  @ApiParam({ name: "attachmentId", description: "Attachment UUID" })
  @ApiResponse({ status: 200, description: "File bytes" })
  @ApiResponse({ status: 400, description: "Attachment is a link, not a file" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "No access to this course" })
  @ApiResponse({ status: 404, description: "Attachment not found" })
  async download(
    @CurrentUser() user: UserWithoutPassword,
    @Param("courseId") courseId: string,
    @Param("moduleId") moduleId: string,
    @Param("materialId") materialId: string,
    @Param("attachmentId") attachmentId: string,
  ) {
    await this.materialAttachmentService.assertCanAccess(
      user.id,
      user.role,
      courseId,
      moduleId,
    );
    const file = await this.materialAttachmentService.downloadFile(
      courseId,
      moduleId,
      materialId,
      attachmentId,
    );
    return new StreamableFile(file.buffer, {
      type: file.mimeType,
      disposition: contentDispositionAttachment(file.fileName),
      length: file.buffer.length,
    });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.teacher)
  @UseFilters(MulterExceptionFilter)
  @UseInterceptors(FileInterceptor("file", materialAttachmentMulterOptions))
  @ApiConsumes("multipart/form-data")
  @ApiBearerAuth("access_token")
  @ApiOperation({
    summary: "Upload a file attachment",
    description:
      "Teacher only. Multipart field **file** (PDF, images, Word, Excel, TXT, ZIP, up to 10 MB). Optional title.",
  })
  @ApiParam({ name: "courseId", description: "Course UUID" })
  @ApiParam({ name: "moduleId", description: "Module UUID" })
  @ApiParam({ name: "materialId", description: "Material UUID" })
  @ApiBody({
    schema: {
      type: "object",
      required: ["file"],
      properties: {
        file: { type: "string", format: "binary" },
        title: { type: "string" },
      },
    },
  })
  @ApiResponse({ status: 201, description: "Attachment created" })
  @ApiResponse({ status: 400, description: "Validation or file type error" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Teachers only" })
  @ApiResponse({ status: 404, description: "Course, module or material not found" })
  async upload(
    @Param("courseId") courseId: string,
    @Param("moduleId") moduleId: string,
    @Param("materialId") materialId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body("title") title?: string,
  ) {
    if (!file) {
      throw new BadRequestException("File is required");
    }
    return this.materialAttachmentService.createFile(
      courseId,
      moduleId,
      materialId,
      file,
      title,
    );
  }

  @Post("link")
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.teacher)
  @ApiBearerAuth("access_token")
  @ApiOperation({
    summary: "Add a link attachment",
    description: "Teacher only. Body: title, url.",
  })
  @ApiParam({ name: "courseId", description: "Course UUID" })
  @ApiParam({ name: "moduleId", description: "Module UUID" })
  @ApiParam({ name: "materialId", description: "Material UUID" })
  @ApiBody({ type: CreateMaterialLinkAttachmentDto })
  @ApiResponse({ status: 201, description: "Attachment created" })
  @ApiResponse({ status: 400, description: "Validation error" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Teachers only" })
  @ApiResponse({ status: 404, description: "Course, module or material not found" })
  createLink(
    @Param("courseId") courseId: string,
    @Param("moduleId") moduleId: string,
    @Param("materialId") materialId: string,
    @Body() dto: CreateMaterialLinkAttachmentDto,
  ) {
    return this.materialAttachmentService.createLink(
      courseId,
      moduleId,
      materialId,
      dto,
    );
  }

  @Patch(":attachmentId")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.teacher)
  @ApiBearerAuth("access_token")
  @ApiOperation({
    summary: "Update an attachment",
    description: "Teacher only. Currently title only.",
  })
  @ApiParam({ name: "courseId", description: "Course UUID" })
  @ApiParam({ name: "moduleId", description: "Module UUID" })
  @ApiParam({ name: "materialId", description: "Material UUID" })
  @ApiParam({ name: "attachmentId", description: "Attachment UUID" })
  @ApiBody({ type: UpdateMaterialAttachmentDto })
  @ApiResponse({ status: 200, description: "Attachment updated" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Teachers only" })
  @ApiResponse({ status: 404, description: "Attachment not found" })
  update(
    @Param("courseId") courseId: string,
    @Param("moduleId") moduleId: string,
    @Param("materialId") materialId: string,
    @Param("attachmentId") attachmentId: string,
    @Body() dto: UpdateMaterialAttachmentDto,
  ) {
    return this.materialAttachmentService.update(
      courseId,
      moduleId,
      materialId,
      attachmentId,
      dto,
    );
  }

  @Delete(":attachmentId")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.teacher)
  @ApiBearerAuth("access_token")
  @ApiOperation({
    summary: "Delete an attachment",
    description:
      "Teacher only. Removes the Cloudinary file when storage_key is set.",
  })
  @ApiParam({ name: "courseId", description: "Course UUID" })
  @ApiParam({ name: "moduleId", description: "Module UUID" })
  @ApiParam({ name: "materialId", description: "Material UUID" })
  @ApiParam({ name: "attachmentId", description: "Attachment UUID" })
  @ApiResponse({ status: 200, description: "Attachment deleted" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Teachers only" })
  @ApiResponse({ status: 404, description: "Attachment not found" })
  delete(
    @Param("courseId") courseId: string,
    @Param("moduleId") moduleId: string,
    @Param("materialId") materialId: string,
    @Param("attachmentId") attachmentId: string,
  ) {
    return this.materialAttachmentService.delete(
      courseId,
      moduleId,
      materialId,
      attachmentId,
    );
  }
}
