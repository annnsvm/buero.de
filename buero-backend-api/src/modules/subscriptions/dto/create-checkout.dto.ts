import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsUrl, IsUUID } from "class-validator";

export class CreateCheckoutDto {
  @ApiProperty({ description: "UUID курсу для підписки" })
  @IsUUID()
  course_id!: string;

  @ApiPropertyOptional({ description: "URL редіректу після успішної оплати" })
  @IsOptional()
  @IsUrl()
  success_url?: string;

  @ApiPropertyOptional({ description: "URL редіректу при скасуванні" })
  @IsOptional()
  @IsUrl()
  cancel_url?: string;
}
