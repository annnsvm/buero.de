import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpStatus,
} from "@nestjs/common";
import type { Response } from "express";
import { MulterError } from "multer";

@Catch(MulterError)
export class MulterExceptionFilter implements ExceptionFilter {
  catch(exception: MulterError, host: ArgumentsHost): void {
    const res = host.switchToHttp().getResponse<Response>();
    let message = exception.message;

    if (exception.code === "LIMIT_FILE_SIZE") {
      message = "Розмір файлу не може перевищувати 5 MB";
    }

    res.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message,
      error: "Bad Request",
    });
  }
}
