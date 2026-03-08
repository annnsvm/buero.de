import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDate, IsEnum, IsOptional, IsString, IsUUID } from "class-validator";
import { SubscriptionStatus } from "src/generated/prisma/enums";

export class SubscriptionResponseDto {
  @ApiProperty({ description: "ID підписки" })
  @IsUUID()
  id!: string;

  @ApiProperty({ description: "ID курсу" })
  @IsUUID()
  course_id!: string;

  @ApiProperty({ description: "Stripe Subscription ID" })
  @IsString()
  stripe_subscription_id!: string;

  @ApiProperty({ description: "Статус підписки", enum: SubscriptionStatus })
  @IsEnum(SubscriptionStatus)
  status!: string;

  @ApiPropertyOptional({ description: "Дата початку поточного періоду" })
  @IsOptional()
  @IsDate()
  current_period_start?: Date;

  @ApiPropertyOptional({ description: "Дата закінчення поточного періоду" })
  @IsOptional()
  @IsDate()
  current_period_end?: Date;

  @ApiPropertyOptional({ description: "Дата скасування підписки" })
  @IsOptional()
  @IsDate()
  canceled_at?: Date;

  @ApiPropertyOptional({ description: "Причина скасування підписки" })
  @IsOptional()
  @IsString()
  cancellation_reason?: string;

  @ApiProperty({ description: "Дата створення" })
  @IsDate()
  created_at!: Date;

  @ApiProperty({ description: "Дата оновлення" })
  @IsDate()
  updated_at!: Date;
}