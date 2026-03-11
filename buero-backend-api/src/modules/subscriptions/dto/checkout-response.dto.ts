import { ApiProperty } from "@nestjs/swagger";
import { IsUrl } from "class-validator";

export class UrlResponseDto {
  @ApiProperty({ description: "URL для переходу на платіжну сторінку" })
  @IsUrl()
  url!: string;
}
