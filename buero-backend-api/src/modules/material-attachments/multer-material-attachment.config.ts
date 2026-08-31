import { BadRequestException } from "@nestjs/common";
import type { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { memoryStorage } from "multer";

export const MATERIAL_ATTACHMENT_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "application/zip",
] as const;

export const MATERIAL_ATTACHMENT_MAX_BYTES = 10 * 1024 * 1024;

export const materialAttachmentMulterOptions: MulterOptions = {
  storage: memoryStorage(),
  limits: { fileSize: MATERIAL_ATTACHMENT_MAX_BYTES },
  fileFilter: (
    _req: Express.Request,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    const allowed = MATERIAL_ATTACHMENT_MIME_TYPES as readonly string[];
    if (!allowed.includes(file.mimetype)) {
      callback(
        new BadRequestException(
          "Unsupported file type. Allowed: PDF, JPEG, PNG, WebP, GIF, Word, Excel, TXT, ZIP.",
        ),
        false,
      );
      return;
    }
    callback(null, true);
  },
};
