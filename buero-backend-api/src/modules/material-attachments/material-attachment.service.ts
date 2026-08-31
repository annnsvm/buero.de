import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "crypto";
import { AttachmentKind, Role } from "src/generated/prisma/enums";
import { CloudinaryService } from "../../cloudinary/cloudinary.service";
import { PrismaService } from "../../prisma/prisma.service";
import { CourseMaterialService } from "../course-materials/course-material.service";
import {
  CreateMaterialLinkAttachmentDto,
  UpdateMaterialAttachmentDto,
} from "./dto/material-attachment.dto";

type SerializedAttachment = {
  id: string;
  materialId: string;
  kind: AttachmentKind;
  title: string;
  url: string;
  fileName: string | null;
  mimeType: string | null;
  sizeBytes: number | null;
  orderIndex: number;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class MaterialAttachmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly courseMaterialService: CourseMaterialService,
  ) {}

  async assertCanAccess(
    userId: string,
    role: Role,
    courseId: string,
    moduleId: string,
  ): Promise<void> {
    await this.courseMaterialService.assertCanAccessModule(
      userId,
      role,
      courseId,
      moduleId,
    );
  }

  async list(
    courseId: string,
    moduleId: string,
    materialId: string,
  ): Promise<SerializedAttachment[]> {
    await this.courseMaterialService.findOne(courseId, moduleId, materialId);
    const items = await this.prisma.materialAttachment.findMany({
      where: { materialId },
      orderBy: { orderIndex: "asc" },
    });
    return items.map((item) => this.serialize(item));
  }

  async createFile(
    courseId: string,
    moduleId: string,
    materialId: string,
    file: Express.Multer.File,
    title?: string,
  ): Promise<SerializedAttachment> {
    if (!file) {
      throw new BadRequestException("File is required");
    }
    await this.courseMaterialService.findOne(courseId, moduleId, materialId);

    const publicId = randomUUID();
    const uploaded = await this.cloudinaryService.uploadFile(file.buffer, {
      folder: `materials/${materialId}`,
      publicId,
    });

    const nextOrderIndex = await this.nextOrderIndex(materialId);
    const attachment = await this.prisma.materialAttachment.create({
      data: {
        materialId,
        kind: AttachmentKind.file,
        title: (title?.trim() || file.originalname || "Attachment").slice(
          0,
          500,
        ),
        url: uploaded.url,
        fileName: file.originalname || null,
        mimeType: file.mimetype || null,
        sizeBytes: file.size ?? null,
        storageKey: `${uploaded.resourceType}:${uploaded.publicId}`,
        orderIndex: nextOrderIndex,
      },
    });
    return this.serialize(attachment);
  }

  async createLink(
    courseId: string,
    moduleId: string,
    materialId: string,
    dto: CreateMaterialLinkAttachmentDto,
  ): Promise<SerializedAttachment> {
    await this.courseMaterialService.findOne(courseId, moduleId, materialId);
    const nextOrderIndex = await this.nextOrderIndex(materialId);
    const attachment = await this.prisma.materialAttachment.create({
      data: {
        materialId,
        kind: AttachmentKind.link,
        title: dto.title.trim(),
        url: dto.url,
        orderIndex: nextOrderIndex,
      },
    });
    return this.serialize(attachment);
  }

  async update(
    courseId: string,
    moduleId: string,
    materialId: string,
    attachmentId: string,
    dto: UpdateMaterialAttachmentDto,
  ): Promise<SerializedAttachment> {
    const existing = await this.findOwned(
      courseId,
      moduleId,
      materialId,
      attachmentId,
    );
    const attachment = await this.prisma.materialAttachment.update({
      where: { id: existing.id },
      data: {
        ...(dto.title !== undefined && { title: dto.title.trim() }),
      },
    });
    return this.serialize(attachment);
  }

  async downloadFile(
    courseId: string,
    moduleId: string,
    materialId: string,
    attachmentId: string,
  ): Promise<{ buffer: Buffer; fileName: string; mimeType: string }> {
    const existing = await this.findOwned(
      courseId,
      moduleId,
      materialId,
      attachmentId,
    );
    if (existing.kind !== AttachmentKind.file) {
      throw new BadRequestException("This attachment is a link, not a file");
    }
    const buffer = await this.cloudinaryService.downloadStoredFile({
      storageKey: existing.storageKey,
      url: existing.url,
      fileName: existing.fileName,
      mimeType: existing.mimeType,
    });
    return {
      buffer,
      fileName: existing.fileName?.trim() || existing.title || "attachment",
      mimeType: existing.mimeType || "application/octet-stream",
    };
  }

  async delete(
    courseId: string,
    moduleId: string,
    materialId: string,
    attachmentId: string,
  ): Promise<{ deleted: true; id: string }> {
    const existing = await this.findOwned(
      courseId,
      moduleId,
      materialId,
      attachmentId,
    );
    if (existing.storageKey) {
      const [resourceType, ...publicIdParts] = existing.storageKey.split(":");
      const publicId = publicIdParts.join(":");
      if (resourceType && publicId) {
        await this.cloudinaryService.destroyFile(publicId, resourceType);
      }
    }
    await this.prisma.materialAttachment.delete({ where: { id: existing.id } });
    return { deleted: true, id: existing.id };
  }

  private async findOwned(
    courseId: string,
    moduleId: string,
    materialId: string,
    attachmentId: string,
  ) {
    await this.courseMaterialService.findOne(courseId, moduleId, materialId);
    const attachment = await this.prisma.materialAttachment.findFirst({
      where: { id: attachmentId, materialId },
    });
    if (!attachment) {
      throw new NotFoundException(
        `Attachment ${attachmentId} was not found on this material`,
      );
    }
    return attachment;
  }

  private async nextOrderIndex(materialId: string): Promise<number> {
    const maxOrder = await this.prisma.materialAttachment.aggregate({
      where: { materialId },
      _max: { orderIndex: true },
    });
    return (maxOrder._max.orderIndex ?? -1) + 1;
  }

  private serialize(attachment: {
    id: string;
    materialId: string;
    kind: AttachmentKind;
    title: string;
    url: string;
    fileName: string | null;
    mimeType: string | null;
    sizeBytes: number | null;
    orderIndex: number;
    createdAt: Date;
    updatedAt: Date;
  }): SerializedAttachment {
    return {
      id: attachment.id,
      materialId: attachment.materialId,
      kind: attachment.kind,
      title: attachment.title,
      url: attachment.url,
      fileName: attachment.fileName,
      mimeType: attachment.mimeType,
      sizeBytes: attachment.sizeBytes,
      orderIndex: attachment.orderIndex,
      createdAt: attachment.createdAt,
      updatedAt: attachment.updatedAt,
    };
  }
}
