import {
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
}
