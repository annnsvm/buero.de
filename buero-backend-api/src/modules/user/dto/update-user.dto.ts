import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
export enum LanguageEnum {
  en = 'en',
  de = 'de',
}
export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Europe/Berlin' })
  @IsOptional()
  @IsString()
  timezone?: string;
  @ApiPropertyOptional({ enum: LanguageEnum })
  @IsOptional()
  @IsEnum(LanguageEnum)
  language?: LanguageEnum;
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bio?: string;
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
