import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CourseCategory, Language, Level } from '../../../generated/prisma/enums';

export class ListCoursesQueryDto {
  @ApiPropertyOptional({ enum: CourseCategory, description: 'Фільтр за категорією' })
  @IsOptional()
  @IsEnum(CourseCategory)
  category?: CourseCategory;

  @ApiPropertyOptional({ enum: Language, description: 'Фільтр за мовою контенту' })
  @IsOptional()
  @IsEnum(Language)
  language?: Language;

  @ApiPropertyOptional({
    example: 'Language,Integration',
    description: 'Фільтр за тегами (через кому). Курс має містити хоча б один із тегів.',
  })
  @IsOptional()
  @IsString()
  tags?: string;

  @ApiPropertyOptional({ enum: Level, description: 'Фільтр за рівнем курсу (A1, A2, B1, B2)' })
  @IsOptional()
  @IsEnum(Level)
  level?: Level;
}
