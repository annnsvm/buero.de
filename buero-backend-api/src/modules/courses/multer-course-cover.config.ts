import { BadRequestException } from "@nestjs/common";
import type { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { memoryStorage } from "multer";

/** Дозволені MIME для обкладинки курсу */
export const COURSE_COVER_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

/** Максимальний розмір файлу — 5 MB */
export const COURSE_COVER_MAX_BYTES = 5 * 1024 * 1024;

export const courseCoverMulterOptions: MulterOptions = {
  storage: memoryStorage(),
  limits: { fileSize: COURSE_COVER_MAX_BYTES },
  fileFilter: (
    _req: Express.Request,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    const allowed = COURSE_COVER_MIME_TYPES as readonly string[];
    if (!allowed.includes(file.mimetype)) {
      callback(
        new BadRequestException(
          "Недопустимий тип файлу. Дозволено: JPEG, PNG, WebP.",
        ),
        false,
      );
      return;
    }
    callback(null, true);
  },
};
