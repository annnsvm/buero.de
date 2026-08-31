import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { v2 as cloudinary } from "cloudinary";

export type UploadImageOptions = {
  /** Папка в Cloudinary Media Library, напр. courses */
  folder: string;
  /** public_id (напр. courseId) — при overwrite повторне завантаження замінює ресурс */
  publicId: string;
};

export type UploadFileOptions = {
  folder: string;
  publicId: string;
};

export type UploadedFileResult = {
  url: string;
  publicId: string;
  resourceType: string;
};

export type DownloadStoredFileParams = {
  storageKey: string | null;
  url: string;
  fileName: string | null;
  mimeType: string | null;
};

const FORMAT_BY_MIME: Record<string, string> = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "application/zip": "zip",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",
  "application/vnd.ms-excel": "xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "text/plain": "txt",
};

@Injectable()
export class CloudinaryService implements OnModuleInit {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor(private readonly configService: ConfigService) {}

  onModuleInit(): void {
    const cloudName = this.configService.get<string>("CLOUDINARY_CLOUD_NAME");
    const apiKey = this.configService.get<string>("CLOUDINARY_API_KEY");
    const apiSecret = this.configService.get<string>("CLOUDINARY_API_SECRET");

    if (!cloudName || !apiKey || !apiSecret) {
      this.logger.warn(
        "Cloudinary не налаштовано (CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET). Завантаження обкладинок не працюватиме.",
      );
      return;
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
  }

  /**
   * Завантажує зображення з буфера в Cloudinary, повертає secure_url.
   */
  async uploadImage(
    buffer: Buffer,
    options: UploadImageOptions,
  ): Promise<string> {
    const cloudName = this.configService.get<string>("CLOUDINARY_CLOUD_NAME");
    if (!cloudName) {
      throw new BadRequestException(
        "Cloudinary не налаштовано. Додайте CLOUDINARY_* у .env.",
      );
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: options.folder,
          public_id: options.publicId,
          overwrite: true,
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            this.logger.error("Cloudinary upload failed", error);
            reject(
              new InternalServerErrorException(
                "Не вдалося завантажити зображення в Cloudinary",
              ),
            );
            return;
          }
          const url = result?.secure_url ?? result?.url;
          if (!url) {
            reject(
              new InternalServerErrorException(
                "Cloudinary не повернув URL зображення",
              ),
            );
            return;
          }
          resolve(url);
        },
      );

      uploadStream.end(buffer);
    });
  }

  /**
   * Uploads an arbitrary file (PDF, image, document) with resource_type auto.
   */
  async uploadFile(
    buffer: Buffer,
    options: UploadFileOptions,
  ): Promise<UploadedFileResult> {
    const cloudName = this.configService.get<string>("CLOUDINARY_CLOUD_NAME");
    if (!cloudName) {
      throw new BadRequestException(
        "Cloudinary is not configured. Add CLOUDINARY_* to .env.",
      );
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: options.folder,
          public_id: options.publicId,
          overwrite: false,
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            this.logger.error("Cloudinary file upload failed", error);
            reject(this.mapUploadError(error));
            return;
          }
          const url = result?.secure_url ?? result?.url;
          const publicId = result?.public_id;
          const resourceType = result?.resource_type;
          if (!url || !publicId || !resourceType) {
            reject(
              new InternalServerErrorException(
                "Cloudinary did not return a file URL",
              ),
            );
            return;
          }
          resolve({ url, publicId, resourceType });
        },
      );

      uploadStream.end(buffer);
    });
  }

  /**
   * Fetches file bytes for a lesson attachment.
   * Prefers Cloudinary's signed Admin download URL so PDFs/ZIPs still work
   * when public CDN delivery is restricted on the free plan.
   */
  async downloadStoredFile(params: DownloadStoredFileParams): Promise<Buffer> {
    const urls = this.buildDownloadUrls(params);
    if (urls.length === 0) {
      throw new BadGatewayException("Could not download the file.");
    }

    for (const url of urls) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          return Buffer.from(await response.arrayBuffer());
        }
        this.logger.warn(
          `Attachment download HTTP ${response.status} from ${this.safeUrlForLog(url)}`,
        );
      } catch (error) {
        this.logger.warn("Attachment download fetch failed", error);
      }
    }

    throw new BadGatewayException("Could not download the file. Try again later.");
  }

  private buildDownloadUrls(params: DownloadStoredFileParams): string[] {
    const urls: string[] = [];
    const parsed = this.parseStorageKey(params.storageKey);
    const format = this.fileFormat(params.fileName, params.mimeType);

    if (parsed) {
      if (format) {
        try {
          urls.push(
            cloudinary.utils.private_download_url(parsed.publicId, format, {
              resource_type: parsed.resourceType,
              type: "upload",
              attachment: true,
              expires_at: Math.floor(Date.now() / 1000) + 120,
            }),
          );
        } catch (error) {
          this.logger.warn("Cloudinary private_download_url failed", error);
        }
      }

      urls.push(
        cloudinary.url(parsed.publicId, {
          resource_type: parsed.resourceType,
          type: "upload",
          sign_url: true,
          secure: true,
          flags: "attachment",
          ...(format ? { format } : {}),
        }),
      );
    }

    if (params.url && !urls.includes(params.url)) {
      urls.push(params.url);
    }
    return urls;
  }

  private parseStorageKey(
    storageKey: string | null,
  ): { resourceType: string; publicId: string } | null {
    if (!storageKey) return null;
    const separator = storageKey.indexOf(":");
    if (separator <= 0 || separator === storageKey.length - 1) return null;
    return {
      resourceType: storageKey.slice(0, separator),
      publicId: storageKey.slice(separator + 1),
    };
  }

  private fileFormat(fileName: string | null, mimeType: string | null): string {
    if (fileName?.includes(".")) {
      const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
      if (/^[a-z0-9]{1,8}$/.test(ext)) {
        return ext === "jpeg" ? "jpg" : ext;
      }
    }
    if (mimeType && FORMAT_BY_MIME[mimeType]) {
      return FORMAT_BY_MIME[mimeType];
    }
    return "";
  }

  private safeUrlForLog(url: string): string {
    try {
      const parsed = new URL(url);
      parsed.search = "";
      return parsed.toString();
    } catch {
      return "[invalid-url]";
    }
  }

  async destroyFile(publicId: string, resourceType: string): Promise<void> {
    const cloudName = this.configService.get<string>("CLOUDINARY_CLOUD_NAME");
    if (!cloudName) return;

    try {
      await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
      });
    } catch (error) {
      this.logger.error("Cloudinary destroy failed", error);
    }
  }

  private mapUploadError(error: unknown): Error {
    const httpCode =
      error && typeof error === "object" && "http_code" in error
        ? Number((error as { http_code?: number }).http_code)
        : undefined;
    const message =
      error && typeof error === "object" && "message" in error
        ? String((error as { message?: unknown }).message ?? "")
        : "";

    if (httpCode === 400 || /file size too large/i.test(message)) {
      return new BadRequestException(
        "File is too large. Maximum size is 10 MB.",
      );
    }
    return new InternalServerErrorException(
      "Failed to upload file to Cloudinary",
    );
  }
}
