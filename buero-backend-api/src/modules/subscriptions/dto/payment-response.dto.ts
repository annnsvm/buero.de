import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDate, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class PaymentResponseDto {
  @ApiProperty({ description: "ID платежу" })
  @IsUUID()
  id!: string;

  @ApiProperty({ description: "ID користувача" })
  @IsUUID()
  user_id!: string;

  @ApiPropertyOptional({ description: "ID курсу" })
  @IsOptional()
  @IsUUID()
  course_id?: string;

  @ApiPropertyOptional({ description: "ID підписки" })
  @IsOptional()
  @IsUUID()
  subscription_id?: string;

  @ApiProperty({ description: "ID Stripe Invoice" })
  @IsString()
  stripe_invoice_id!: string;

  @ApiProperty({ description: "Сума платежа" })
  @IsNumber()
  amount!: number;

  @ApiProperty({ description: "Валюта" })
  @IsString()
  currency!: string;

  @ApiProperty({ description: "Статус платежа" })
  @IsString()
  status!: string;

  @ApiProperty({ description: "Дата створення" })
  @IsDate()
  created_at!: Date;
}