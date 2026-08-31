import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsUrl, MaxLength } from "class-validator";

export class CreateMaterialLinkAttachmentDto {
  @ApiProperty({ example: "Handout", description: "Attachment title" })
  @IsString()
  @MaxLength(500)
  title!: string;

  @ApiProperty({
    example: "https://example.com/worksheet",
    description: "External URL",
  })
  @IsUrl({ require_protocol: true })
  url!: string;
}

export class UpdateMaterialAttachmentDto {
  @ApiPropertyOptional({ example: "Lesson PDF", description: "Attachment title" })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  title?: string;
}
